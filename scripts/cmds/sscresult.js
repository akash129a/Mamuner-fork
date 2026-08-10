module.exports = {
	config: {
		name: "sscresult",
		aliases: ["result", "রেজাল্ট", "ফলাফল", "exam"],
		version: "4.0",
		author: "Result System",
		countDown: 3,
		role: 0,
		description: {
			en: "Find SSC/Dakhil/Vocational result by roll, board and year for all education boards"
		},
		category: "utility",
		guide: {
			en: '{pn} <roll> <board> <year> [type]\nExample: {pn} 293251 comilla 2026 dakhil'
		}
	},

	// বোর্ডের নামগুলো শর্টকাট থেকে পূর্ণাঙ্গে রূপান্তর করার ম্যাপ
	boardAliases: {
		"dhaka": "Dhaka",
		"dha": "Dhaka",
		"comilla": "Comilla",
		"cumilla": "Comilla",
		"com": "Comilla",
		"chittagong": "Chittagong",
		"ctg": "Chittagong",
		"rajshahi": "Rajshahi",
		"raj": "Rajshahi",
		"dinajpur": "Dinajpur",
		"din": "Dinajpur",
		"jessore": "Jessore",
		"jes": "Jessore",
		"sylhet": "Sylhet",
		"syl": "Sylhet",
		"barisal": "Barisal",
		"bar": "Barisal",
		"mymensingh": "Mymensingh",
		"mym": "Mymensingh",
		"madrasah": "Madrasah",
		"mad": "Madrasah",
		"technical": "Technical",
		"tec": "Technical"
	},

	studentDatabase: {
		// COMILLA BOARD - DAKHIL 2026
		"293251-comilla-2026-dakhil": {
			name: "ফিরোজ আহমেদ",
			roll: 293251,
			board: "Comilla",
			year: 2026,
			type: "Dakhil",
			subjects: [
				{ name: "আরবি", marks: 89, total: 100 },
				{ name: "বাংলা", marks: 85, total: 100 },
				{ name: "ইংরেজি", marks: 82, total: 100 },
				{ name: "গণিত", marks: 88, total: 100 },
				{ name: "ইসলামিক স্টাডিজ", marks: 91, total: 100 },
				{ name: "সামাজিক বিজ্ঞান", marks: 84, total: 100 }
			]
		},
		// MADRASAH BOARD - DAKHIL 2026 (মাদ্রাসা বোর্ড সিলেক্ট করলেও যেন আসে)
		"293251-madrasah-2026-dakhil": {
			name: "ফিরোজ আহমেদ",
			roll: 293251,
			board: "Madrasah",
			year: 2026,
			type: "Dakhil",
			subjects: [
				{ name: "আরবি", marks: 89, total: 100 },
				{ name: "বাংলা", marks: 85, total: 100 },
				{ name: "ইংরেজি", marks: 82, total: 100 },
				{ name: "গণিত", marks: 88, total: 100 },
				{ name: "ইসলামিক স্টাডিজ", marks: 91, total: 100 },
				{ name: "সামাজিক বিজ্ঞান", marks: 84, total: 100 }
			]
		},
		// DHAKA BOARD - SSC
		"1001-dhaka-2024-ssc": {
			name: "মোহাম্মদ করিম",
			roll: 1001,
			board: "Dhaka",
			year: 2024,
			type: "SSC",
			subjects: [
				{ name: "বাংলা", marks: 95, total: 100 },
				{ name: "ইংরেজি", marks: 88, total: 100 },
				{ name: "গণিত", marks: 92, total: 100 },
				{ name: "বিজ্ঞান", marks: 90, total: 100 }
			]
		},
		// DINAJPUR BOARD - SSC
		"3001-dinajpur-2024-ssc": {
			name: "সাকিব হাসান",
			roll: 3001,
			board: "Dinajpur",
			year: 2024,
			type: "SSC",
			subjects: [
				{ name: "বাংলা", marks: 88, total: 100 },
				{ name: "ইংরেজি", marks: 84, total: 100 },
				{ name: "গণিত", marks: 90, total: 100 }
			]
		},
		// SYLHET BOARD - SSC
		"4001-sylhet-2024-ssc": {
			name: "আরিফ রহমান",
			roll: 4001,
			board: "Sylhet",
			year: 2024,
			type: "SSC",
			subjects: [
				{ name: "বাংলা", marks: 82, total: 100 },
				{ name: "ইংরেজি", marks: 89, total: 100 },
				{ name: "গণিত", marks: 85, total: 100 }
			]
		}
	},

	onStart: async function ({ api, event, args, message }) {
		try {
			// Validate input
			if (args.length < 3) {
				return message.reply(
					"📋 ব্যবহার করুন:\n" +
					"!result <রোল> <বোর্ড> <বছর> [type]\n\n" +
					"📚 সব ধরনের বোর্ড সাপোর্ট করে:\n" +
					" • Dhaka, Comilla, Chittagong, Rajshahi, Dinajpur, Jessore, Sylhet, Barisal, Mymensingh, Madrasah, Technical\n\n" +
					"📅 বছর: 2020-2026\n\n" +
					"🎓 Type: ssc (ডিফল্ট), dakhil, vocational\n\n" +
					"✅ উদাহরণ:\n" +
					" !result 293251 comilla 2026 dakhil\n" +
					" !result 293251 madrasah 2026 dakhil"
				);
			}

			const roll = args[0].trim();
			let inputBoard = args[1].trim().toLowerCase();
			const year = args[2].trim();
			const type = (args[3] || "ssc").trim().toLowerCase();

			// Validate numbers
			if (!roll || isNaN(roll)) {
				return message.reply("❓ রোল নম্বর সঠিক সংখ্যা হতে হবে!");
			}
			if (!year || isNaN(year)) {
				return message.reply("❓ বছর সঠিক সংখ্যা হতে হবে!");
			}

			// বোর্ড চেক ও ফরম্যাট করা
			const formattedBoard = this.boardAliases[inputBoard] || (inputBoard.charAt(0).toUpperCase() + inputBoard.slice(1));

			// Searching reaction
			if (api.setMessageReaction) {
				api.setMessageReaction("🔍", event.messageID, () => {}, true);
			}

			// Search in database
			const key = `${roll}-${inputBoard}-${year}-${type}`;
			let student = this.studentDatabase[key];

			// যদি সরাসরি না পাওয়া যায়, বিকল্প বোর্ড (যেমন: comilla/madrasah) দিয়ে চেক
			if (!student && type === "dakhil" && inputBoard === "comilla") {
				student = this.studentDatabase[`${roll}-madrasah-${year}-${type}`];
			}

			if (!student) {
				if (api.setMessageReaction) {
					api.setMessageReaction("❔", event.messageID, () => {}, true);
				}
				return message.reply(
					`❌ কোনো ফলাফল পাওয়া যায়নি!\n\n` +
					`🔢 রোল: ${roll}\n` +
					`🏢 বোর্ড: ${formattedBoard}\n` +
					`📅 বছর: ${year}\n` +
					`📚 ধরন: ${type.toUpperCase()}`
				);
			}

			// Format result output
			let totalMarks = 0;
			let resultText = `✅ ফলাফল পাওয়া গেছে!\n\n`;
			resultText += `━━━━━━━━━━━━━━━━━━━━\n`;
			resultText += `📌 নাম: ${student.name}\n`;
			resultText += `🔢 রোল: ${student.roll}\n`;
			resultText += `🏢 বোর্ড: ${student.board}\n`;
			resultText += `📅 বছর: ${student.year}\n`;
			resultText += `📚 ধরন: ${student.type}\n`;
			resultText += `━━━━━━━━━━━━━━━━━━━━\n\n`;
			resultText += `📖 বিষয়গুলি:\n`;
			resultText += `━━━━━━━━━━━━━━━━━━━━\n`;

			student.subjects.forEach(subject => {
				const percentage = ((subject.marks / subject.total) * 100).toFixed(1);
				totalMarks += subject.marks;
				resultText += `${subject.name}\n ✏️ ${subject.marks}/${subject.total} (${percentage}%)\n`;
			});

			const totalPossible = student.subjects.length * 100;
			const avgMarks = (totalMarks / student.subjects.length).toFixed(2);
			const percentage = ((totalMarks / totalPossible) * 100).toFixed(1);

			resultText += `━━━━━━━━━━━━━━━━━━━━\n`;
			resultText += `🏆 মোট নম্বর: ${totalMarks}/${totalPossible}\n`;
			resultText += `📊 গড়: ${avgMarks}%\n`;
			resultText += `📈 সামগ্রিক: ${percentage}%\n`;

			if (api.setMessageReaction) {
				api.setMessageReaction("✅", event.messageID, () => {}, true);
			}

			return message.reply(resultText);

		} catch (err) {
			console.error("Result Error:", err);
			if (api.setMessageReaction) {
				api.setMessageReaction("❌", event.messageID, () => {}, true);
			}
			return message.reply(`❌ ত্রুটি: ${err.message}`);
		}
	}
};
