"""
API Bridge - Flask API for Node.js to communicate with Fetch.ai agents
This provides a REST API that Node.js can call, which then messages the agents
"""
import json
import uuid
import logging
import threading
import time
from datetime import datetime
from queue import Queue
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

# Job queue and status tracking
job_queue = Queue()
job_status = {}  # {job_id: {status, result, error, created_at, completed_at}}


def process_matching_job(job_id, prompt):
    """Background worker function to process customer matching"""
    from customer.matching import matching

    try:
        logging.info(f"[Job {job_id}] Starting matching for prompt")
        job_status[job_id]["status"] = "processing"

        result = matching(prompt)

        job_status[job_id]["status"] = "completed"
        job_status[job_id]["result"] = result
        job_status[job_id]["completed_at"] = datetime.now().isoformat()
        logging.info(f"[Job {job_id}] Completed successfully")

    except Exception as e:
        logging.error(f"[Job {job_id}] Error: {e}")
        job_status[job_id]["status"] = "failed"
        job_status[job_id]["error"] = str(e)
        job_status[job_id]["completed_at"] = datetime.now().isoformat()


@app.route('/api/jobs', methods=['POST'])
def create_job():
    """
    Submit a customer matching job to the queue

    Request body:
    {
        "prompt": "description of what the customer wants",
        "city": "San Francisco",
        "state": "CA",
        "zipCode": "94102"  (optional)
    }
    """
    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "prompt is required"}), 400

    # Create a unique job ID
    job_id = str(uuid.uuid4())

    # Initialize job status
    job_status[job_id] = {
        "status": "queued",
        "result": None,
        "error": None,
        "created_at": datetime.now().isoformat(),
        "completed_at": None,
        "prompt": prompt,
        "city": data.get("city"),
        "state": data.get("state"),
        "zipCode": data.get("zipCode"),
        "job_type": "matching"
    }

    # Add job to queue
    job_queue.put(("matching", job_id, prompt))

    logging.info(f"[Job {job_id}] Queued for matching")

    return jsonify({
        "jobId": job_id,
        "status": "queued",
        "message": "Job submitted successfully"
    }), 202


@app.route("/api/jobs/<job_id>", methods=["GET"])
def get_matching_job_status(job_id):
    """Check the status of a customer matching job"""
    if job_id not in job_status:
        return jsonify({"error": "Job not found"}), 404

    return jsonify(job_status[job_id]), 200


@app.route("/api/jobs/<job_id>/events", methods=["GET"])
def job_events_stream(job_id):
    """Server-Sent Events stream for job progress updates"""
    if job_id not in job_status:
        return jsonify({"error": "Job not found"}), 404

    def generate():
        # Send initial connected event
        yield f"data: {json.dumps({'stage': 'connected', 'message': 'Connected to job stream', 'jobId': job_id, 'timestamp': datetime.now().isoformat()})}\n\n"

        # Send started event
        yield f"data: {json.dumps({'stage': 'started', 'message': 'Job started', 'jobId': job_id, 'timestamp': datetime.now().isoformat()})}\n\n"

        # Poll for status changes
        last_status = None
        sent_stages = set()  # Track which stages we've already sent
        max_iterations = 120  # 2 minutes max (120 * 1 second)
        iteration = 0

        while iteration < max_iterations:
            current_job = job_status.get(job_id)
            if not current_job:
                break

            current_status = current_job.get('status')

            # Send update if status changed
            if current_status != last_status:
                last_status = current_status

                if current_status == 'queued' and 'queued' not in sent_stages:
                    sent_stages.add('queued')
                    # Already sent in started event, skip

                elif current_status == 'processing':
                    if 'intake' not in sent_stages:
                        sent_stages.add('intake')
                        yield f"data: {json.dumps({'stage': 'intake', 'message': 'Analyzing your project requirements', 'jobId': job_id, 'timestamp': datetime.now().isoformat()})}\n\n"

                    # Wait a bit then send match stage
                    time.sleep(1)
                    if 'match' not in sent_stages:
                        sent_stages.add('match')
                        yield f"data: {json.dumps({'stage': 'match', 'message': 'Finding and ranking matching designers', 'jobId': job_id, 'timestamp': datetime.now().isoformat()})}\n\n"

                elif current_status == 'completed':
                    if 'done' not in sent_stages:
                        sent_stages.add('done')
                        yield f"data: {json.dumps({'stage': 'done', 'message': 'Job completed successfully', 'jobId': job_id, 'timestamp': datetime.now().isoformat()})}\n\n"
                    break

                elif current_status == 'failed':
                    if 'error' not in sent_stages:
                        sent_stages.add('error')
                        error_msg = current_job.get('error', 'Unknown error')
                        yield f"data: {json.dumps({'stage': 'error', 'message': f'Job failed: {error_msg}', 'jobId': job_id, 'timestamp': datetime.now().isoformat()})}\n\n"
                    break

            time.sleep(1)
            iteration += 1

        # If we timed out
        if iteration >= max_iterations and 'error' not in sent_stages:
            yield f"data: {json.dumps({'stage': 'error', 'message': 'Job timed out', 'jobId': job_id, 'timestamp': datetime.now().isoformat()})}\n\n"

    return Response(stream_with_context(generate()), mimetype='text/event-stream', headers={
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
        'Connection': 'keep-alive'
    })

def process_designer_job(job_id, instagram_url):
    """Background worker function to process designer profile creation"""
    from designer.get_designer_profile import get_designer_profile

    try:
        logging.info(f"[Job {job_id}] Starting processing for {instagram_url}")
        job_status[job_id]["status"] = "processing"

        result = get_designer_profile(instagram_url)

        job_status[job_id]["status"] = "completed"
        job_status[job_id]["result"] = result
        job_status[job_id]["completed_at"] = datetime.now().isoformat()
        logging.info(f"[Job {job_id}] Completed successfully")

    except Exception as e:
        logging.error(f"[Job {job_id}] Error: {e}")
        job_status[job_id]["status"] = "failed"
        job_status[job_id]["error"] = str(e)
        job_status[job_id]["completed_at"] = datetime.now().isoformat()


def queue_worker():
    """Background thread that processes jobs from the queue"""
    logging.info("Queue worker started")
    while True:
        job_data = job_queue.get()

        # Handle different job types
        if job_data[0] == "matching":
            _, job_id, prompt = job_data
            process_matching_job(job_id, prompt)
        elif job_data[0] == "designer":
            _, job_id, instagram_url = job_data
            process_designer_job(job_id, instagram_url)
        else:
            # Legacy format for backward compatibility (designer jobs)
            job_id, instagram_url = job_data
            process_designer_job(job_id, instagram_url)

        job_queue.task_done()


@app.route("/designer", methods=["POST"])
def create_designer():
    """Submit a designer profile creation job to the queue"""
    data = request.get_json()
    instagram_url = data.get("instagram_url")

    if not instagram_url:
        return jsonify({"error": "instagram_url is required"}), 400

    # Create a unique job ID
    job_id = str(uuid.uuid4())

    # Initialize job status
    job_status[job_id] = {
        "status": "queued",
        "result": None,
        "error": None,
        "created_at": datetime.now().isoformat(),
        "completed_at": None,
        "instagram_url": instagram_url,
        "job_type": "designer"
    }

    # Add job to queue
    job_queue.put(("designer", job_id, instagram_url))

    logging.info(f"[Job {job_id}] Queued for {instagram_url}")

    return jsonify({
        "job_id": job_id,
        "status": "queued",
        "message": "Job submitted successfully. Use /designer/status/{job_id} to check status."
    }), 202


@app.route("/designer/status/<job_id>", methods=["GET"])
def get_job_status(job_id):
    """Check the status of a designer profile creation job"""
    if job_id not in job_status:
        return jsonify({"error": "Job not found"}), 404

    return jsonify(job_status[job_id]), 200


if __name__ == '__main__':
    print("🌉 Starting ReNOVA Agent Bridge API...")
    print("   Endpoint: http://localhost:8080")
    print("\nAvailable endpoints:")
    print("   POST /api/jobs - Submit customer matching job (async)")
    print("   GET  /api/jobs/<job_id> - Check matching job status")
    print("   GET  /api/jobs/<job_id>/events - SSE stream for job progress")
    print("   POST /designer - Submit designer profile job (async)")
    print("   GET  /designer/status/<job_id> - Check designer job status")

    # Start background worker thread
    worker_thread = threading.Thread(target=queue_worker, daemon=True)
    worker_thread.start()
    logging.info("Background worker thread started")

    app.run(host='0.0.0.0', port=8080, debug=False)
