const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const apiUrl = "https://raw.githubusercontent.com/Saim-x69x/sakura/main/ApiUrl.json";

// API URL ক্যাশ করুন (বারবার fetch না করতে)
let cachedApiUrl = null;
let apiUrlFetchTime = 0;

async function getApiUrl() {
  try {
    // ৫ মিনিটের জন্য ক্যাশ করা URL ব্যবহার করুন
    const now = Date.now();
    if (cachedApiUrl && (now - apiUrlFetchTime) < 300000) {
      console.log("📌 Using cached API URL");
      return cachedApiUrl;
    }

    console.log("🌐 Fetching API URL from GitHub...");
    const res = await axios.get(apiUrl, { timeout: 10000 });
    
    const url = res.data?.apiv3;
    if (!url) {
      throw new Error("apiv3 key not found in ApiUrl.json");
    }

    cachedApiUrl = url;
    apiUrlFetchTime = now;
    console.log("✅ API URL loaded successfully");
    return url;

  } catch (error) {
    console.error("❌ Failed to get API URL:", error.message);
    throw new Error(`API URL Error: ${error.message}`);
  }
}

async function urlToBase64(url) {
  try {
    console.log("🖼️  Downloading image from URL...");
    
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!res.data || res.data.length === 0) {
      throw new Error("Image data is empty");
    }

    const base64 = Buffer.from(res.data).toString("base64");
    console.log(`✅ Image downloaded successfully (${res.data.length} bytes)`);
    return base64;

  } catch (error) {
    console.error("❌ Failed to fetch image:", error.message);
    throw new Error(`Image Download Error: ${error.message}`);
      }
      throw new Error(`API returned non-image data: ${errMsg}`);
    }

    if (!res.data || res.data.length === 0) {
      throw new Error("API returned empty image data");
    }

    console.log(`✅ Image edited successfully (${res.data.length} bytes)`);
    return Buffer.from(res.data);

  } catch (error) {
    console.error("❌ API Error:", error.message);
    if (error.response?.data) {
      try {
        const errText = Buffer.from(error.response.data).toString("utf8");
        console.error("API Response:", errText);
      } catch {}
    }
    throw new Error(`Image Editing Error: ${error.message}`);
  }
}

module.exports = {
  config: {
    name: "edit",
    version: "2.0",
    author: "Saimx69x (Api by Kay) - Fixed Version",
    countDown: 5,
    role: 0,
    shortDescription: "Edit an image using text prompt",
    longDescription: "Only edits an existing image. Must reply to an image.",
    category: "ai",
    guide: "{p}edit <prompt> (reply to an image)\n\nExample:\n/edit make it anime style\n/edit add sunset colors"
  },

  onStart: async function ({ api, event, args, message }) {
        return message.reply(
          "❌ Please reply to an image to edit it.\n\nExample:\n/edit make it anime style"
        );
      }

      console.log("📷 Image type:", repliedImage.type);
      console.log("🔗 Image URL:", repliedImage.url?.substring(0, 50) + "...");

      if (!["photo", "image"].includes(repliedImage.type)) {
        return message.reply(
          "❌ The replied message doesn't contain a valid image.\n\nPlease reply to an actual image."
        );
      }

      // ২. Prompt চেক করুন
      const prompt = args.join(" ").trim();
      console.log("📝 Prompt:", prompt);

      if (!prompt) {
        return message.reply(
          "❌ Please provide an edit prompt.\n\nExample:\n/edit make it anime style"
        );
      }

      // ৩. Processing message পাঠান
      const processingMsg = await message.reply("🖌️ Editing image... Please wait");
      console.log("✅ Processing message sent");

      // ৪. Cache directory তৈরি করুন
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const imgPath = path.join(cacheDir, `${Date.now()}_edit.jpg`);
      console.log("📁 Cache path:", imgPath);

      // ৫. API URL পান
      const API_URL = await getApiUrl();

      const editedImageBuffer = await editImage(API_URL, base64Image, prompt);

      // ৮. Edited image save করুন
      await fs.writeFile(imgPath, editedImageBuffer);
      console.log("💾 Image saved to cache");

      // ৯. Processing message delete করুন
      try {
        await api.unsendMessage(processingMsg.messageID);
        console.log("🗑️  Processing message deleted");
      } catch (e) {
        console.warn("⚠️  Could not delete processing message:", e.message);
      }

      // ১০. Edited image পাঠান
      await message.reply({
        body: `✅ Image edited successfully!\n\n📝 Prompt: ${prompt}`,
        attachment: fs.createReadStream(imgPath)
      });

      console.log("✅ Edited image sent successfully");
      console.log("=".repeat(60) + "\n");

    } catch (error) {
      console.error("❌ MAIN ERROR:", error.message);
      console.error("Error stack:", error.stack);

      // Processing message delete করার চেষ্টা করুন
      try {
        if (arguments[0].processingMsg) {
          await api.unsendMessage(arguments[0].processingMsg.messageID);
        }
      } catch (e) {
        console.warn("⚠️  Could not delete error processing message:", e.message);
      }

      // User কে error message পাঠান
      const errorMsg = error.message.includes("API")
        ? "❌ Image editing API error. Try again later."
        : error.message.includes("Download")
        ? "❌ Failed to download image. Check if the image URL is valid."
        : error.message.includes("URL")
        ? "❌ API configuration error. Contact admin."
        : "❌ Something went wrong. Please try again.";

      await message.reply(errorMsg);
      console.log("=".repeat(60) + "\n");

    } finally {
      // Cache files cleanup (optional - uncomment if you want auto cleanup)
      /*
      try {
        const cacheDir = path.join(__dirname, "cache");
        if (fs.existsSync(cacheDir)) {
          const files = await fs.readdir(cacheDir);
          for (const file of files) {
            const filePath = path.join(cacheDir, file);
            const stat = await fs.stat(filePath);
            // ১ ঘন্টার পুরাতন files delete করুন
            if (Date.now() - stat.mtime.getTime() > 3600000) {
              await fs.remove(filePath);
            }
          }
        }
      } catch (e) {
        console.warn("⚠️  Cache cleanup error:", e.message);
      }
      */
    }
  }
};
