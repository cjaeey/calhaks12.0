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
        Make request through Lava proxy
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
            print(f"❌ Lava request failed: {str(e)}")
            # Fallback to direct API call if Lava fails
            print("🔄 Falling back to direct Anthropic API...")
            response = self.anthropic_client.messages.create(
                model=model,
                max_tokens=max_tokens,
                messages=messages,
                **kwargs
            )
            return response.model_dump()


# Global instance
lava_claude_client = LavaClaudeClient()
