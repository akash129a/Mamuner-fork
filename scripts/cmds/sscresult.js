const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports = {
	config: {
		name: "sscresult",
		aliases: ["result", "রেজাল্ট", "ফলাফল"],
		version: "2.0",
		author: "SSC Result System",
		countDown: 3,
		role: 0,
		description: {
			bn: "ছাত্রের রোল নম্বর এবং সাল দিয়ে SSC রেজাল্ট খুঁজুন",
			en: "Find SSC result by roll number and year",
			vi: "Tìm kiếm kết quả SSC theo số cuộn và năm"
		},
		category: "utility",
		guide: {
			bn: '   {pn} <রোল নম্বর> <বছর>: ছাত্রের ফলাফল খুঁজুন\n   উদাহরণ: {pn} 1001 2024',
			en: '   {pn} <roll number> <year>: Find student result\n   Example: {pn} 1001 2024',
			vi: '   {pn} <số cuộn> <năm>: Tìm kết quả sinh viên\n   Ví dụ: {pn} 1001 2024'
		}
	},

	langs: {
		bn: {
			noArgs: "❌ দয়া করে রোল নম্বর এবং বছর দিন!\n💡 উদাহরণ: /রেজাল্ট 1001 2024",
			noRoll: "❌ রোল নম্বর আগে দিন! 📝",
			noYear: "❌ বছর দিন! 📅",
			searching: "🔍 সার্চ করছি... একটু অপেক্ষা করুন! ⏳",
			notFound: "❌ রোল: %1 এবং বছর: %2 এর জন্য কোন ফলাফল পাওয়া যায়নি।",
			success: "✅ ফলাফল পাওয়া গেছে!",
			error: "❌ ত্রুটি: %1",
			name: "নাম",
			roll: "রোল",
			year: "বছর",
			subject: "বিষয়",
			marks: "নম্বর",
			total: "মোট",
			percentage: "শতাংশ",
			totalMarks: "মোট নম্বর",
			average: "গড়"
		},
		en: {
			noArgs: "❌ Please provide roll number and year!\n💡 Example: /result 1001 2024",
			noRoll: "❌ Please provide roll number! 📝",
			noYear: "❌ Please provide year! 📅",
			searching: "🔍 Searching... Please wait! ⏳",
			notFound: "❌ No result found for roll: %1 and year: %2",
			success: "✅ Result found!",
			error: "❌ Error: %1",
			name: "Name",
			roll: "Roll",
			year: "Year",
			subject: "Subject",
			marks: "Marks",
			total: "Total",
			percentage: "Percentage",
			totalMarks: "Total Marks",
			average: "Average"
		},
		vi: {
			noArgs: "❌ Vui lòng cung cấp số cuộn và năm!\n💡 Ví dụ: /result 1001 2024",
			noRoll: "❌ Vui lòng cung cấp số cuộn! 📝",
			noYear: "❌ Vui lòng cung cấp năm! 📅",
			searching: "🔍 Đang tìm kiếm... Vui lòng chờ! ⏳",
			notFound: "❌ Không tìm thấy kết quả cho số cuộn: %1 và năm: %2",
			success: "✅ Tìm thấy kết quả!",
			error: "❌ Lỗi: %1",
			name: "Tên",
			roll: "Số cuộn",
			year: "Năm",
			subject: "Môn học",
			marks: "Điểm",
			total: "Tổng",
			percentage: "Phần trăm",
			totalMarks: "Tổng điểm",
			average: "Trung bình"
		}
	},

	// ডাটাবেস - এখানে আপনার ছাত্রদের তথ্য যোগ করুন
	studentDatabase: {
		"1001-2024": {
			name: "মোহাম্মদ করিম",
			roll: 1001,
			year: 2024,
			subjects: [
				{ name: "বাংলা", marks: 95, total: 100 },
				{ name: "ইংরেজি", marks: 88, total: 100 },
				{ name: "গণিত", marks: 92, total: 100 },
				{ name: "বিজ্ঞান", marks: 90, total: 100 },
				{ name: "সামাজিক বিজ্ঞান", marks: 87, total: 100 },
				{ name: "তথ্য ও যোগাযোগ প্রযুক্তি", marks: 94, total: 100 }
			]
		},
		"1002-2024": {
			name: "ফাতিমা আক্তার",
			roll: 1002,
			year: 2024,
			subjects: [
				{ name: "বাংলা", marks: 98, total: 100 },
				{ name: "ইংরেজি", marks: 91, total: 100 },
				{ name: "গণিত", marks: 89, total: 100 },
				{ name: "বিজ্ঞান", marks: 93, total: 100 },
				{ name: "সামাজিক বিজ্ঞান", marks: 90, total: 100 },
				{ name: "তথ্য ও যোগাযোগ প্রযুক্তি", marks: 96, total: 100 }
			]
		},
		"1003-2024": {
			name: "আহমেদ হোসেন",
			roll: 1003,
			year: 2024,
			subjects: [
				{ name: "বাংলা", marks: 85, total: 100 },
				{ name: "ইংরেজি", marks: 82, total: 100 },
				{ name: "গণিত", marks: 88, total: 100 },
				{ name: "বিজ্ঞান", marks: 86, total: 100 },
				{ name: "সামাজিক বিজ্ঞান", marks: 84, total: 100 },
				{ name: "তথ্য ও যোগাযোগ প্রযুক্তি", marks: 90, total: 100 }
			]
		},
		"1001-2023": {
			name: "মোহাম্মদ করিম",
			roll: 1001,
			year: 2023,
			subjects: [
				{ name: "বাংলা", marks: 92, total: 100 },
				{ name: "ইংরেজি", marks: 85, total: 100 },
				{ name: "গণিত", marks: 89, total: 100 },
				{ name: "বিজ্ঞান", marks: 87, total: 100 },
				{ name: "সামাজিক বিজ্ঞান", marks: 84, total: 100 },
				{ name: "তথ্য ও যোগাযোগ প্রযুক্তি", marks: 91, total: 100 }
			]
		}
	},

	onStart: async function ({ api, event, args, message, getLang }) {
		try {
			// ভ্যালিডেশন
			if (args.length < 2) {
				api.setMessageReaction("❌", event.messageID, () => {}, true);
				return message.reply(getLang("noArgs"));
			}

			const roll = args[0].trim();
			const year = args[1].trim();

			if (!roll || isNaN(roll)) {
				return message.reply(getLang("noRoll"));
			}

			if (!year || isNaN(year)) {
				return message.reply(getLang("noYear"));
			}

			// সার্চিং ইন্ডিকেটর
			api.setMessageReaction("🔍", event.messageID, () => {}, true);
			const searchMsg = await message.reply(getLang("searching"));

			// ডেটাবেসে খুঁজুন
			const key = `${roll}-${year}`;
			const student = this.studentDatabase[key];

			if (!student) {
				if (searchMsg?.messageID) api.unsendMessage(searchMsg.messageID);
				api.setMessageReaction("❌", event.messageID, () => {}, true);
				return message.reply(getLang("notFound", roll, year));
			}

			// ফলাফল প্রসেস করুন
			let totalMarks = 0;
			let resultText = `✅ ${getLang("success")}\n\n`;
			resultText += `📌 ${getLang("name")}: ${student.name}\n`;
			resultText += `🔢 ${getLang("roll")}: ${student.roll}\n`;
			resultText += `📅 ${getLang("year")}: ${student.year}\n`;
			resultText += `━━━━━━━━━━━━━━━━━━\n\n`;
			resultText += `📚 ${getLang("subject")} | ${getLang("marks")} | ${getLang("percentage")}\n`;
			resultText += `━━━━━━━━━━━━━━━━━━\n`;

			student.subjects.forEach(subject => {
				const percentage = ((subject.marks / subject.total) * 100).toFixed(1);
				totalMarks += subject.marks;
				resultText += `${subject.name}\n  ${subject.marks}/${subject.total} (${percentage}%)\n`;
			});

			const avgMarks = (totalMarks / student.subjects.length).toFixed(2);
			resultText += `━━━━━━━━━━━━━━━━━━\n`;
			resultText += `🏆 ${getLang("totalMarks")}: ${totalMarks}\n`;
			resultText += `📊 ${getLang("average")}: ${avgMarks}%\n`;

			if (searchMsg?.messageID) api.unsendMessage(searchMsg.messageID);

			api.setMessageReaction("✅", event.messageID, () => {}, true);
			return message.reply(resultText);

		} catch (err) {
			console.error("SSC Result Error:", err);
			api.setMessageReaction("❌", event.messageID, () => {}, true);
			return message.reply(getLang("error", err.message));
		}
	}
};
