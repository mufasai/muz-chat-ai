# 🚀 AI App Builder

Generate full React applications with AI in seconds!

## ✨ Features

- **AI-Powered Generation**: Describe your app, AI generates complete code
- **Live Preview**: See your app running in real-time with Sandpack
- **Multiple Models**: Choose between DeepSeek Chat (fast) or GPT-4o Mini (better quality)
- **Full Code Access**: View and edit all generated files
- **Download**: Export your project as ZIP

## 🎯 How to Use

1. **Navigate to Builder**
   - Click "App Builder" button in sidebar
   - Or go to `http://localhost:5173/builder`

2. **Describe Your App**
   ```
   Example prompts:
   - "Buatkan dashboard admin dengan sidebar, header, dan table users"
   - "Buatkan landing page untuk startup dengan hero section dan pricing"
   - "Buatkan todo app dengan CRUD functionality"
   ```

3. **Select Model**
   - **DeepSeek Chat**: Fast & cheap (~Rp 50-100 per generation)
   - **GPT-4o Mini**: Better quality (~Rp 200-500 per generation)

4. **Generate & Preview**
   - Click "Generate App"
   - Wait 10-30 seconds
   - See live preview on the right
   - Edit code if needed

5. **Download**
   - Click "Download ZIP" to export project
   - Extract and run with `npm install && npm start`

## 📝 Example Prompts

### Dashboard
```
Buatkan dashboard admin dengan:
- Sidebar navigation
- Header dengan user profile
- Statistics cards
- Table untuk manage users
- Dark mode support
```

### Landing Page
```
Buatkan landing page modern untuk SaaS startup dengan:
- Hero section dengan CTA button
- Features section (3 kolom)
- Pricing table (3 tiers)
- Footer dengan social links
```

### Todo App
```
Buatkan todo app dengan:
- Input untuk add task
- List tasks dengan checkbox
- Delete button per task
- Filter: All, Active, Completed
- Local storage persistence
```

## 💰 Cost Estimation

**DeepSeek Chat:**
- ~500-1000 tokens per generation
- Cost: Rp 50-100 per app
- Speed: 10-15 seconds

**GPT-4o Mini:**
- ~1000-2000 tokens per generation
- Cost: Rp 200-500 per app
- Speed: 15-30 seconds
- Better code quality

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Preview**: Sandpack (CodeSandbox)
- **AI**: OpenRouter API (DeepSeek / GPT-4o Mini)
- **Backend**: Express.js proxy

## 🔧 Troubleshooting

**Generation Failed:**
- Try different model
- Simplify your prompt
- Check server logs

**Preview Not Working:**
- Check browser console
- Ensure all files are generated
- Try regenerating

**Slow Generation:**
- DeepSeek is faster than GPT-4o Mini
- Complex apps take longer
- Wait up to 60 seconds

## 🎨 Tips for Best Results

1. **Be Specific**: Include details about layout, features, styling
2. **Start Simple**: Test with simple apps first
3. **Iterate**: Generate, review, regenerate with improvements
4. **Use Examples**: Reference the example prompts
5. **Choose Right Model**: DeepSeek for speed, GPT-4o for quality

## 🚧 Limitations

- Maximum 4000 tokens output (medium-sized apps)
- React only (no Vue/Angular yet)
- No backend generation (frontend only)
- No package installation (uses CDN when possible)

## 🔮 Future Features

- [ ] Download as ZIP
- [ ] Share generated apps
- [ ] More frameworks (Vue, Svelte)
- [ ] Backend generation
- [ ] Database integration
- [ ] Deploy to Vercel/Netlify
- [ ] Template library
- [ ] Code editing in preview

## 📞 Support

Issues? Contact or check server logs at `server/server.js`
