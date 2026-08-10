module.exports = {
	config: {
		name: "sscresult",
		aliases: ["result", "রেজাল্ট", "ফলাফল", "exam"],
		version: "3.5",
		author: "Result System",
		countDown: 3,
		role: 0,
		description: {
			en: "Find SSC/Dakhil result by roll, board and year"
		},
		category: "utility",
		guide: {
			en: '{pn} <roll> <board> <year> [type]\nExample: {pn} 1001 Dhaka 2024 ssc'
		}
	},

	studentDatabase: {
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
				{ name: "বিজ্ঞান", marks: 90, total: 100 },
				{ name: "সামাজিক বিজ্ঞান", marks: 87, total: 100 },
				{ name: "তথ্য ও যোগাযোগ প্রযুক্তি", marks: 94, total: 100 }
			]
		},
		"1002-dhaka-2024-ssc": {
			name: "ফাতিমা আক্তার",
			roll: 1002,
			board: "Dhaka",
			year: 2024,
			type: "SSC",
			subjects: [
				{ name: "বাংলা", marks: 98, total: 100 },
				{ name: "ইংরেজি", marks: 91, total: 100 },
				{ name: "গণিত", marks: 89, total: 100 },
				{ name: "বিজ্ঞান", marks: 93, total: 100 },
				{ name: "সামাজিক বিজ্ঞান", marks: 90, total: 100 }
			]
		},
		"1003-dhaka-2024-ssc": {
			name: "আহমেদ হোসেন",
			roll: 1003,
			board: "Dhaka",
			year: 2024,
			type: "SSC",
			subjects: [
				{ name: "বাংলা", marks: 85, total: 100 },
				{ name: "ইংরেজি", marks: 82, total: 100 },
				{ name: "গণিত", marks: 88, total: 100 },
				{ name: "বিজ্ঞান", marks: 86, total: 100 }
			]
		},

		// DHAKA BOARD - DAKHIL
		"2001-dhaka-2024-dakhil": {
			name: "নাজমা খাতুন",
			roll: 2001,
			board: "Dhaka",
			year: 2024,
			type: "Dakhil",
			subjects: [
				{ name: "আরবি", marks: 92, total: 100 },
				{ name: "বাংলা", marks: 88, total: 100 },
				{ name: "ইংরেজি", marks: 85, total: 100 },
				{ name: "গণিত", marks: 90, total: 100 },
				{ name: "ইসলামিক স্টাডিজ", marks: 95, total: 100 }
			]
		},
		"2002-dhaka-2024-dakhil": {
			name: "মোহাম্মদ আলী",
			roll: 2002,
			board: "Dhaka",
			year: 2024,
			type: "Dakhil",
			subjects: [
				{ name: "আরবি", marks: 88, total: 100 },
				{ name: "বাংলা", marks: 86, total: 100 },
				{ name: "ইংরেজি", marks: 83, total: 100 },
				{ name: "গণিত", marks: 87, total: 100 }
			]
		},

		// CHITTAGONG BOARD - SSC
		"1101-chittagong-2024-ssc": {
			name: "রহিম আহমেদ",
			roll: 1101,
			board: "Chittagong",
			year: 2024,
			type: "SSC",
			subjects: [
				{ name: "বাংলা", marks: 90, total: 100 },
				{ name: "ইংরেজি", marks: 85, total: 100 },
				{ name: "গণিত", marks: 91, total: 100 },
				{ name: "বিজ্ঞান", marks: 89, total: 100 }
			]
		},
		"1102-chittagong-2024-ssc": {
			name: "জয়া রায়",
			roll: 1102,
			board: "Chittagong",
			year: 2024,
			type: "SSC",
			subjects: [
				{ name: "বাংলা", marks: 96, total: 100 },
				{ name: "ইংরেজি", marks: 93, total: 100 },
				{ name: "গণিত", marks: 94, total: 100 },
				{ name: "বিজ্ঞান", marks: 92, total: 100 }
			]
		},

		// RAJSHAHI BOARD - SSC
		"1201-rajshahi-2024-ssc": {
			name: "করিম মিয়া",
			roll: 1201,
			board: "Rajshahi",
			year: 2024,
			type: "SSC",
			subjects: [
				{ name: "বাংলা", marks: 87, total: 100 },
				{ name: "ইংরেজি", marks: 84, total: 100 },
				{ name: "গণিত", marks: 86, total: 100 },
				{ name: "বিজ্ঞান", marks: 88, total: 100 }
			]
		},

		// 2023 YEAR DATA
		"1001-dhaka-2023-ssc": {
			name: "মোহাম্মদ করিম",
			roll: 1001,
			board: "Dhaka",
			year: 2023,
			type: "SSC",
			subjects: [
				{ name: "বাংলা", marks: 92, total: 100 },
				{ name: "ইংরেজি", marks: 85, total: 100 },
				{ name: "গণিত", marks: 89, total: 100 },
				{ name: "বিজ্ঞান", marks: 87, total: 100 }
			]
		},
		"2001-dhaka-2023-dakhil": {
			name: "নাজমা খাতুন",
			roll: 2001,
			board: "Dhaka",
			year: 2023,
			type: "Dakhil",
			subjects: [
				{ name: "আরবি", marks: 90, total: 100 },
				{ name: "বাংলা", marks: 86, total: 100 },
				{ name: "ইংরেজি", marks: 83, total: 100 },
				{ name: "গণিত", marks: 88, total: 100 }
			]
		},

		// 2022 YEAR DATA
		"1001-dhaka-2022-ssc": {
			name: "মোহাম্মদ করিম",
			roll: 1001,
			board: "Dhaka",
			year: 2022,
			type: "SSC",
			subjects: [
				{ name: "বাংলা", marks: 90, total: 100 },
				{ name: "ইংরেজি", marks: 83, total: 100 },
				{ name: "গণিত", marks: 87, total: 100 },
				{ name: "বিজ্ঞান", marks: 85, total: 100 }
			]
		},

		// 2021 YEAR DATA
		"1001-dhaka-2021-ssc": {
			name: "মোহাম্মদ করিম",
			roll: 1001,
			board: "Dhaka",
			year: 2021,
			type: "SSC",
			subjects: [
				{ name: "বাংলা", marks: 88, total: 100 },
				{ name: "ইংরেজি", marks: 81, total: 100 },
				{ name: "গণিত", marks: 85, total: 100 },
				{ name: "বিজ্ঞান", marks: 83, total: 100 }
			]
		},

		// 2020 YEAR DATA
		"1001-dhaka-2020-ssc": {
			name: "মোহাম্মদ করিম",
			roll: 1001,
			board: "Dhaka",
			year: 2020,
			type: "SSC",
			subjects: [
				{ name: "বাংলা", marks: 86, total: 100 },
				{ name: "ইংরেজি", marks: 79, total: 100 },
				{ name: "গণিত", marks: 83, total: 100 },
				{ name: "বিজ্ঞান", marks: 81, total: 100 }
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
					"📚 বোর্ড:\n" +
					"  • dhaka, chittagong, rajshahi\n\n" +
					"📅 বছর: 2020-2024\n\n" +
					"🎓 Type: ssc (ডিফল্ট), dakhil\n\n" +
					"✅ উদাহরণ:\n" +
					"  !result 1001 dhaka 2024\n" +
					"  !result 2001 dhaka 2024 dakhil"
				);
			}

			const roll = args[0].trim();
			const board = args[1].trim().toLowerCase();
			const year = args[2].trim();
			const type = (args[3] || "ssc").trim().toLowerCase();

			// Validate numbers
			if (!roll || isNaN(roll)) {
				return message.reply("❓ রোল নম্বর সংখ্যা হতে হবে!");
			}

			if (!year || isNaN(year)) {
				return message.reply("❓ বছর সংখ্যা হতে হবে!");
			}

			if (type !== "ssc" && type !== "dakhil") {
				return message.reply("❓ Type 'ssc' অথবা 'dakhil' হতে হবে");
			}

			// Show searching
			api.setMessageReaction("🔍", event.messageID, () => {}, true);

			// Search in database
			const key = `${roll}-${board}-${year}-${type}`;
			const student = this.studentDatabase[key];

			if (!student) {
				api.setMessageReaction("❔", event.messageID, () => {}, true);
				return message.reply(
					"💡 এই তথ্যে কোনো ফলাফল পাওয়া যায়নি।\n\n" +
					"✅ সঠিক ফরম্যাট ব্যবহার করুন:\n" +
					"  !result 1001 dhaka 2024\n\n" +
					"📝 টেস্ট করুন:\n" +
					"  !result 1001 dhaka 2024 ssc\n" +
					"  !result 1002 dhaka 2024 ssc\n" +
					"  !result 2001 dhaka 2024 dakhil"
				);
			}

			// Format result
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
				resultText += `${subject.name}\n  ✏️ ${subject.marks}/${subject.total} (${percentage}%)\n`;
			});

			const avgMarks = (totalMarks / student.subjects.length).toFixed(2);
			const percentage = ((totalMarks / (student.subjects.length * 100)) * 100).toFixed(1);

			resultText += `━━━━━━━━━━━━━━━━━━━━\n`;
			resultText += `🏆 মোট নম্বর: ${totalMarks}/${student.subjects.length * 100}\n`;
			resultText += `📊 গড়: ${avgMarks}%\n`;
			resultText += `📈 সামগ্রিক: ${percentage}%\n`;

			api.setMessageReaction("✅", event.messageID, () => {}, true);
			return message.reply(resultText);

		} catch (err) {
			console.error("Result Error:", err);
			api.setMessageReaction("❌", event.messageID, () => {}, true);
			return message.reply(`❌ ত্রুটি: ${err.message}`);
		}
	}
};
