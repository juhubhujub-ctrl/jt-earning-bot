document.addEventListener("DOMContentLoaded", () => {
    // টেলিগ্রাম ওয়েব অ্যাপ অবজেক্ট
    const tg = window.Telegram.WebApp;
    tg.ready(); // অ্যাপ প্রস্তুত বলে টেলিগ্রামকে জানানো
    tg.expand(); // অ্যাপকে পুরো স্ক্রিনে দেখানো

    // DOM এলিমেন্টগুলো সিলেক্ট করা
    const pages = document.querySelectorAll(".page");
    const navItems = document.querySelectorAll(".nav-item");
    const pageTitleText = document.getElementById("page-title-text");
    const headerUserInfo = document.querySelector(".user-info");

    // --- ডামি ডাটা (ব্যাকএন্ড না থাকায়) ---
    // আমরা টেলিগ্রাম থেকে আসল নাম, ইউজারনেম নিবো, কিন্তু ব্যালেন্স ডামি থাকবে
    let userData = {};
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        userData = tg.initDataUnsafe.user;
    } else {
        // যদি টেলিগ্রামের বাইরে খোলা হয়, তবে টেস্ট ডাটা
        userData = { first_name: "Test", last_name: "User", username: "testuser", id: 12345 };
    }

    const appData = {
        name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
        username: userData.username ? `@${userData.username}` : "N/A",
        avatar: (userData.first_name || "T").charAt(0) + (userData.last_name || "U").charAt(0),
        balance: 1059,
        adsWatched: 38,
        referrals: 0,
        totalTasks: 80,
        completedTasks: 0,
        referralLink: `https://t.me/YOUR_BOT_USERNAME_HERE?start=${userData.id}`
    };

    // --- UI তে ডাটা বসানোর ফাংশন ---
    function populateData() {
        // Header
        document.getElementById("user-name-header").innerText = appData.name;
        document.getElementById("user-avatar").innerText = appData.avatar;
        document.getElementById("user-balance-header").innerText = appData.balance;

        // Home Page
        document.getElementById("user-name-welcome").innerText = appData.name;
        document.getElementById("total-earnings-home").innerText = appData.balance;
        document.getElementById("total-ads-home").innerText = appData.adsWatched;

        // Earn Page
        document.getElementById("total-tasks").innerText = appData.totalTasks;
        document.getElementById("completed-tasks").innerText = appData.completedTasks;
        document.getElementById("remaining-tasks").innerText = appData.totalTasks - appData.completedTasks;
        updateProgressBar();

        // Withdraw Page
        document.getElementById("available-balance-withdraw").innerText = appData.balance;
        
        // Profile Page
        document.getElementById("user-avatar-profile").innerText = appData.avatar;
        document.getElementById("user-name-profile").innerText = appData.name;
        document.getElementById("user-username-profile").innerText = appData.username;
        document.getElementById("user-balance-profile").innerText = appData.balance;
        document.getElementById("total-earnings-profile").innerText = appData.balance;
        document.getElementById("total-ads-profile").innerText = appData.adsWatched;
        document.getElementById("total-referrals-profile").innerText = appData.referrals;

        // Refer Page
        document.getElementById("referral-link").value = appData.referralLink;
        document.getElementById("total-referrals-refer").innerText = appData.referrals;
    }

    // --- প্রোগ্রেস বার আপডেট ---
    function updateProgressBar() {
        const progress = (appData.completedTasks / appData.totalTasks) * 100;
        document.getElementById("task-progress-fill").style.width = `${progress}%`;
    }

    // --- পেজ পরিবর্তনের গ্লোবাল ফাংশন ---
    window.showPage = (pageId) => {
        // সব পেজ হাইড করা
        pages.forEach(page => page.classList.remove("active"));
        
        // টার্গেট পেজ দেখানো
        const targetPage = document.getElementById(pageId);
        targetPage.classList.add("active");

        // নেভিগেশন বাটন হাইলাইট করা
        navItems.forEach(item => {
            item.classList.toggle("active", item.dataset.page === pageId);
        });

        // হেডার টাইটেল পরিবর্তন
        if (pageId === 'home-page') {
            headerUserInfo.style.display = 'flex';
            pageTitleText.style.display = 'none';
        } else {
            headerUserInfo.style.display = 'none';
            pageTitleText.style.display = 'block';
            
            if (pageId === 'earn-page') pageTitleText.innerText = "Earn Rewards";
            else if (pageId === 'withdraw-page') pageTitleText.innerText = "Withdraw Funds";
            else if (pageId === 'profile-page') pageTitleText.innerText = "User Profile";
            else if (pageId === 'refer-page') pageTitleText.innerText = "Refer & Earn";
        }
        // প্রতিটি পেজ চেঞ্জে স্ক্রল উপরে নিয়ে যাওয়া
        window.scrollTo(0, 0);
    };

    // --- নেভিগেশন বাটনগুলোতে ক্লিক ইভেন্ট সেট করা ---
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            showPage(item.dataset.page);
        });
    });

    // --- (!!!) Monetag অ্যাড লাগানোর সেকশন ---
    document.getElementById("start-task-btn").addEventListener("click", () => {
        
        // --- মনিট্যাগের ডাইরেক্ট লিঙ্ক এখানে বসান ---
        // ধাপ ৬ থেকে পাওয়া লিঙ্কটি এখানে পেস্ট করুন।
        const monetagDirectLink = "https://your-monetag-direct-link.com"; 
        
        if (monetagDirectLink === "https://your-monetag-direct-link.com") {
            tg.showAlert("Monetag link not configured. Please contact developer.");
            return;
        }

        // নতুন ট্যাবে অ্যাডের লিঙ্ক খোলা
        tg.openLink(monetagDirectLink);

        // যেহেতু ব্যাকএন্ড নেই, আমরা সাময়িকভাবে ফ্রন্টএন্ডেই ডাটা আপডেট করবো
        // (অ্যাপ রিলোড হলে এই ডাটা চলে যাবে)
        if (appData.completedTasks < appData.totalTasks) {
            appData.completedTasks++;
            appData.adsWatched++;
            appData.balance += 50; // ডামি রিওয়ার্ড
            
            // UI আপডেট করা
            populateData();
            
            // ইউজারকে ফিডব্যাক দেওয়া
            tg.HapticFeedback.notificationOccurred("success");
        } else {
            tg.showAlert("You have completed all tasks for today!");
        }
    });

    // --- উইথড্র ফর্ম সাবমিট ---
    document.getElementById("withdraw-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const amount = document.getElementById("withdraw-amount").value;
        const wallet = document.getElementById("wallet-info").value;

        // যেহেতু ব্যাকএন্ড নেই, আমরা শুধু একটি সফল বার্তা দেখাবো
        tg.showPopup({
            title: "Request Submitted",
            message: `Your withdrawal request for ${amount} SHIB to ${wallet} has been submitted for review.`,
            buttons: [{ type: "ok" }]
        });
        
        e.target.reset(); // ফর্ম রিসেট
        showPage('home-page'); // হোম পেজে ফেরত পাঠানো
    });

    // --- রেফার লিঙ্ক কপি করা ---
    document.getElementById("copy-link-btn").addEventListener("click", () => {
        const link = document.getElementById("referral-link");
        link.select();
        link.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            navigator.clipboard.writeText(link.value);
            tg.HapticFeedback.notificationOccurred("success");
            tg.showAlert("Referral link copied to clipboard!");
        } catch (err) {
            tg.showAlert("Failed to copy link.");
        }
    });

    // --- টেলিগ্রামে শেয়ার বাটন ---
    document.getElementById("share-telegram-btn").addEventListener("click", () => {
        const shareText = "🔥 Join this amazing bot and earn SHIB daily! 🔥";
        tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(appData.referralLink)}&text=${encodeURIComponent(shareText)}`);
    });

    // --- অ্যাপ প্রথম লোড হলে ---
    populateData(); // সব ডামি ডাটা UI তে দেখানো
    tg.HapticFeedback.impactOccurred("light"); // অ্যাপ লোড হলে হালকা ভাইব্রেশন
});
