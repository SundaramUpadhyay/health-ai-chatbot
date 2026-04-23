# Push to GitHub - Authentication Guide

Your code is ready to push to GitHub! Follow these steps:

## Option 1: Using Personal Access Token (Recommended)

### Step 1: Create a Personal Access Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "Git CLI"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't be able to see it again!)

### Step 2: Push with Token
Run this command (replace YOUR_TOKEN with the token you just created):

```bash
cd "c:\Users\Sundaram Upadhyay\Downloads\code"
git push -u origin main --force
```

When prompted for username and password:
- **Username**: `SundaramUpadhyay`
- **Password**: Paste your Personal Access Token

### Option 2: Configure Git Credential Helper (Store Credentials)

```bash
# Store credentials locally
git config --global credential.helper wincred

# Then push (you'll be prompted once, then credentials are saved)
git push -u origin main --force
```

### Option 3: Using GitHub CLI (gh)

If you have GitHub CLI installed:

```bash
# Login to GitHub (opens browser)
gh auth login

# Then push
git push -u origin main --force
```

## After Successful Push

Your repository will be at:
https://github.com/SundaramUpadhyay/health-ai-chatbot

You'll see:
```
✓ frontend-new/    (Next.js frontend)
✓ backend-new/     (Python AI backend)
```

## Troubleshooting

**"fatal: unable to access repository"**
- Check your Personal Access Token has `repo` scope
- Verify the token hasn't expired
- Check your internet connection

**"Authentication failed"**
- Double-check your token was pasted correctly
- Regenerate a new token from GitHub

**"Permission denied"**
- Ensure your GitHub account has write access to the repository
- Check repository settings on GitHub

## Next Steps

After pushing to GitHub:
1. Go to https://github.com/SundaramUpadhyay/health-ai-chatbot
2. Set up GitHub Actions for CI/CD
3. Configure branch protection rules
4. Add collaborators if needed

---

**Need Help?**
- GitHub Docs: https://docs.github.com
- Personal Access Token: https://github.com/settings/tokens
