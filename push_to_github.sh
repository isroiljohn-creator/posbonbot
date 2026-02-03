#!/bin/bash
echo "🚀 Preparing to push 'telegram_mod_bot' to GitHub..."

# Check for git
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed."
    exit 1
fi

# Check for gh
if ! command -v gh &> /dev/null; then
    echo "⚠️ GitHub CLI (gh) not found."
    echo "Please create a repository manually on https://github.com/new"
    echo "Then run: git remote add origin <YOUR_REPO_URL>"
    echo "And: git push -u origin main"
    exit 1
fi

# Check auth
if ! gh auth status &> /dev/null; then
    echo "🔐 You need to login to GitHub CLI first."
    gh auth login
fi

# Create and push
echo "📦 Creating repository..."
gh repo create telegram_mod_bot --public --source=. --remote=origin --push
echo "✅ Done! Your bot is on GitHub."
