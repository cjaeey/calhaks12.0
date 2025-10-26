"""
Lava Payments integration for Python agents
Routes AI API calls through Lava proxy for usage tracking and billing
"""
import os
import json
import requests
import anthropic
from typing import Dict, List, Optional


class LavaClaudeClient:
    """
    Claude API client that optionally routes through Lava proxy
    """

    def __init__(self):
        self.use_lava = os.getenv("USE_LAVA", "false").lower() == "true"
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY", "demo-key")
        self.lava_forward_token = os.getenv("LAVA_FORWARD_TOKEN", "")
        self.lava_api_url = "https://api.lavapayments.com/v1/forward"
        self.anthropic_base_url = "https://api.anthropic.com/v1/messages"

        # Initialize standard Anthropic client for non-Lava mode
        self.anthropic_client = anthropic.Anthropic(api_key=self.anthropic_key)

    def create_message(
        self,
        model: str,
        max_tokens: int,
        messages: List[Dict],
        **kwargs
    ) -> Dict:
        """
        Create a Claude message, optionally routing through Lava

        Args:
            model: Claude model name
            max_tokens: Max tokens in response
            messages: List of message dicts
            **kwargs: Additional parameters

        Returns:
            Response dict from Claude API
        """
        if not self.use_lava:
            # Direct Anthropic API call
            response = self.anthropic_client.messages.create(
                model=model,
                max_tokens=max_tokens,
                messages=messages,
                **kwargs
            )
            return response.model_dump()

        # Route through Lava
        return self._lava_request(model, max_tokens, messages, **kwargs)

    def _lava_request(
        self,
        model: str,
        max_tokens: int,
        messages: List[Dict],
        **kwargs
    ) -> Dict:
        """
        Make request through Lava proxy with automatic fallback
        """
        payload = {
            "model": model,
            "max_tokens": max_tokens,
            "messages": messages,
            **kwargs
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.lava_forward_token}",
            "anthropic-version": "2023-06-01",
            "x-api-key": self.anthropic_key,
        }

        url = f"{self.lava_api_url}?u={self.anthropic_base_url}"

        try:
            response = requests.post(url, json=payload, headers=headers, timeout=60)
            response.raise_for_status()

            result = response.json()
            print(f"✅ Lava request completed - Usage: {result.get('usage', {})}")
            return result

        except requests.exceptions.RequestException as e:
            # Check if it's a credit/payment error
            is_payment_error = False
            if hasattr(e, 'response') and e.response is not None:
                is_payment_error = (e.response.status_code == 402 or
                                  e.response.status_code == 429)

            error_msg = str(e).lower()
            is_credit_error = 'credit' in error_msg or 'insufficient' in error_msg

            if is_payment_error or is_credit_error:
                print("⚠️  Lava credits exhausted or payment error detected")
            else:
                print(f"⚠️  Lava request failed: {str(e)}")

            # Fallback to direct API call
            print("🔄 Falling back to direct Anthropic API...")
            try:
                response = self.anthropic_client.messages.create(
                    model=model,
                    max_tokens=max_tokens,
                    messages=messages,
                    **kwargs
                )
                print("✅ Fallback request completed successfully")
                return response.model_dump()
            except Exception as fallback_error:
                print(f"❌ Both Lava and direct API failed: {str(fallback_error)}")
                raise fallback_error


# Global instance
lava_claude_client = LavaClaudeClient()
