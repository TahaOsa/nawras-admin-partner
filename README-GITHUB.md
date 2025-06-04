# 🏢 Nawras Admin Partner - Expense Tracking System

A modern, responsive expense tracking application built for partner expense management with automated GitHub deployment to DigitalOcean App Platform.

## 🌟 Features

- **💰 Expense Management**: Track and categorize expenses between partners
- **🤝 Settlement Tracking**: Monitor payments and settlements between users
- **📊 Real-time API**: RESTful API with comprehensive endpoints
- **🎨 Beautiful UI**: Modern, responsive interface with gradient design
- **🧪 API Testing**: Built-in interactive API testing interface
- **🚀 Auto-deployment**: GitHub integration with DigitalOcean App Platform
- **📱 Mobile Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Deployment**: DigitalOcean App Platform
- **CI/CD**: GitHub Actions (auto-deploy)
- **Styling**: Custom CSS with modern gradients and animations

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/nawras-admin/nawras-admin-partner.git
   cd nawras-admin-partner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3001
   ```

### Production Deployment

This application is configured for automatic deployment to DigitalOcean App Platform via GitHub integration.

## 📡 API Endpoints

### Health & Status
- `GET /api/health` - Application health check
- `GET /health` - Platform health check

### Expenses
- `GET /api/expenses` - Get all expenses with totals
- `POST /api/expenses` - Create new expense

### Settlements
- `GET /api/settlements` - Get all settlements with totals
- `POST /api/settlements` - Create new settlement

## 📊 API Response Examples

### Health Check
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "version": "2.0.0",
  "server": "github-deployed",
  "environment": "production"
}
```

### Expenses
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "amount": 25.50,
      "description": "Lunch",
      "category": "Food",
      "paidById": "taha",
      "date": "2024-01-15"
    }
  ],
  "total": 1,
  "totalAmount": 25.50
}
```

## 🎨 Features Showcase

### Interactive API Testing
- Built-in API testing interface
- Real-time response display
- JSON formatting and syntax highlighting
- Error handling and display

### Modern UI Design
- Gradient backgrounds
- Card-based layout
- Smooth animations and transitions
- Mobile-first responsive design

### Auto-deployment Pipeline
- GitHub integration
- Automatic deployments on push
- Environment-specific configurations
- Health monitoring

## 🔧 Configuration

### Environment Variables
```bash
PORT=3001                    # Server port (auto-configured on DigitalOcean)
NODE_ENV=production          # Environment mode
```

### DigitalOcean App Platform Configuration
```yaml
name: nawras-admin-partner
services:
- name: web
  source_dir: /
  github:
    repo: nawras-admin/nawras-admin-partner
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /
```

## 🚀 Deployment Status

- ✅ **GitHub Repository**: Connected and configured
- ✅ **Auto-deployment**: Enabled on push to main branch
- ✅ **Health Monitoring**: Automated health checks
- ✅ **Domain Configuration**: Custom domain support
- ✅ **SSL Certificate**: Automatic HTTPS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Nawras Admin Team** - *Initial work and development*

## 🙏 Acknowledgments

- DigitalOcean App Platform for seamless deployment
- Express.js community for the robust framework
- Modern CSS techniques for beautiful UI design

---

**🌐 Live Demo**: [https://partner.nawrasinchina.com](https://partner.nawrasinchina.com)

**📧 Support**: For support and questions, please open an issue in this repository.
