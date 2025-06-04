# 🚀 GitHub Deployment Guide for Nawras Admin Partner

This guide provides step-by-step instructions for deploying the Nawras Admin Partner application using GitHub integration with DigitalOcean App Platform.

## 📋 Prerequisites

- GitHub account
- DigitalOcean account
- Domain configured (partner.nawrasinchina.com)

## 🔧 Step 1: Create GitHub Repository

### Manual Repository Creation

1. **Go to GitHub**: Navigate to [https://github.com/new](https://github.com/new)

2. **Repository Details**:
   - **Repository name**: `nawras-admin-partner`
   - **Description**: `Nawras Admin Partner - Expense Tracking System with DigitalOcean App Platform deployment`
   - **Visibility**: Public (recommended for easier deployment)
   - **Initialize**: Do NOT check "Add a README file" (we already have files)

3. **Create Repository**: Click "Create repository"

### Push Local Code to GitHub

After creating the repository, you'll see instructions. Use these commands in your local project directory:

```bash
# Add the GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/nawras-admin-partner.git

# Rename the default branch to main (if needed)
git branch -M main

# Push the code to GitHub
git push -u origin main
```

## 🌐 Step 2: Create DigitalOcean App

### Using DigitalOcean Control Panel

1. **Navigate to Apps**: Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)

2. **Create App**: Click "Create App"

3. **Connect GitHub**:
   - Choose "GitHub" as the source
   - Authorize DigitalOcean to access your GitHub account
   - Select the `nawras-admin-partner` repository
   - Choose the `main` branch
   - Enable "Autodeploy" for automatic deployments

4. **Configure App**:
   - **App Name**: `nawras-admin-partner`
   - **Region**: Choose closest to your users
   - **Plan**: Basic ($5/month recommended for production)

5. **Service Configuration**:
   - **Service Type**: Web Service
   - **Source Directory**: `/` (root)
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
   - **HTTP Port**: `3001`

6. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3001
   ```

7. **Domain Configuration**:
   - Add custom domain: `partner.nawrasinchina.com`
   - Configure DNS to point to the DigitalOcean app URL

### Using App Spec (Advanced)

Alternatively, you can use the provided `.do/app.yaml` file:

1. In DigitalOcean Apps, click "Create App"
2. Choose "Import from App Spec"
3. Upload or paste the contents of `.do/app.yaml`
4. Review and deploy

## 🔗 Step 3: Configure Domain

### DNS Configuration

1. **In your domain registrar** (or DNS provider):
   - Create a CNAME record for `partner.nawrasinchina.com`
   - Point it to your DigitalOcean app URL (e.g., `nawras-admin-partner-xxxxx.ondigitalocean.app`)

2. **In DigitalOcean**:
   - Go to your app settings
   - Add the custom domain `partner.nawrasinchina.com`
   - Wait for SSL certificate provisioning (automatic)

## ✅ Step 4: Verify Deployment

### Test Endpoints

Once deployed, test these URLs:

1. **Main Application**: https://partner.nawrasinchina.com
2. **Health Check**: https://partner.nawrasinchina.com/api/health
3. **Expenses API**: https://partner.nawrasinchina.com/api/expenses
4. **Settlements API**: https://partner.nawrasinchina.com/api/settlements

### Expected Results

- ✅ Beautiful responsive interface with gradient design
- ✅ Interactive API testing buttons
- ✅ All API endpoints returning JSON data
- ✅ Health check showing `"server": "github-deployed"`

## 🔄 Step 5: Automatic Deployments

### How It Works

- Every push to the `main` branch triggers automatic deployment
- DigitalOcean builds and deploys the new version
- Zero-downtime deployments
- Automatic rollback on failure

### Making Updates

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push origin main
   ```
3. DigitalOcean automatically deploys the changes

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs in DigitalOcean Apps console
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Domain Not Working**:
   - Check DNS propagation (can take up to 24 hours)
   - Verify CNAME record is correct
   - Ensure SSL certificate is provisioned

3. **App Not Starting**:
   - Check application logs
   - Verify `PORT` environment variable
   - Ensure health check endpoint is working

### Monitoring

- **App Logs**: Available in DigitalOcean Apps console
- **Metrics**: CPU, memory, and request metrics
- **Alerts**: Configure alerts for failures and performance issues

## 📊 Performance Optimization

### Recommended Settings

- **Instance Size**: Basic ($5/month) for low-medium traffic
- **Scaling**: Enable auto-scaling for high traffic
- **CDN**: Consider adding DigitalOcean Spaces CDN for static assets

### Monitoring

- Set up alerts for deployment failures
- Monitor response times and error rates
- Use DigitalOcean monitoring for infrastructure metrics

## 🔐 Security

### Best Practices

- Use environment variables for sensitive data
- Enable HTTPS (automatic with custom domains)
- Regular security updates via automatic deployments
- Monitor for vulnerabilities in dependencies

## 📞 Support

### Resources

- [DigitalOcean Apps Documentation](https://docs.digitalocean.com/products/app-platform/)
- [GitHub Actions for DigitalOcean](https://github.com/digitalocean/action-doctl)
- [Node.js Deployment Best Practices](https://docs.digitalocean.com/tutorials/app-deploy-nodejs/)

### Getting Help

1. Check DigitalOcean Apps console for logs and errors
2. Review GitHub repository issues
3. Contact DigitalOcean support for platform issues
4. Use GitHub discussions for application-specific questions

---

**🎉 Congratulations!** Your Nawras Admin Partner application is now deployed with automatic GitHub integration!
