#!/bin/bash
# Antigravity Code - Antigravity Max Mode
# Uses your Antigravity Max subscription with bypass permissions
# This is the default Antigravity Code experience

# Clear any alternative provider settings
unset ANTHROPIC_BASE_URL
unset ANTHROPIC_AUTH_TOKEN
unset ANTHROPIC_MODEL
unset ANTHROPIC_SMALL_FAST_MODEL
unset ANTHROPIC_API_KEY

echo ""
echo -e "\033[92mAntigravity Max Mode - Starting...\033[0m"
echo "Using your Antigravity Max subscription"
echo ""

antigravity --dangerously-skip-permissions "$@"
