const relapseData = [
    {
        icon: "😡",
        title: { en: "Emotional Relapse", zh: "情绪破戒" },
        desc: { en: "Triggered by boredom, anger, suppression, irritability, or fatigue. Emotional instability often seeks relief.", zh: "无聊、愤怒压抑、烦躁、厌倦等负面情绪寻求宣泄。" }
    },
    {
        icon: "❓",
        title: { en: "Doubt Relapse", zh: "疑惑破戒" },
        desc: { en: "Starts with a doubt about the process, leading to wavering resolve, and finally relapse.", zh: "对戒色产生疑惑，动摇决心，最终导致破戒。" }
    },
    {
        icon: "👀",
        title: { en: "Temptation Relapse", zh: "诱惑破戒" },
        desc: { en: "Exposure to images, videos, or dirty jokes. Guard your eyes and ears.", zh: "接触到色情图片、视频或段子。必须严防视听。" }
    },
    {
        icon: "🛌",
        title: { en: "Snoozing Relapse", zh: "赖床破戒" },
        desc: { en: "Staying in bed too long after waking up. Very common; get up immediately.", zh: "醒后赖床不亦乐乎。非常多见，醒来应立即起床。" }
    },
    {
        icon: "😫",
        title: { en: "Stress Relapse", zh: "压力破戒" },
        desc: { en: "Seeking escape from pressure in work, life, or study.", zh: "工作、生活或学习压力大，试图通过破戒逃避。" }
    },
    {
        icon: "💭",
        title: { en: "Fantasy Relapse", zh: "YY破戒" },
        desc: { en: "Intentional fantasizing (memories or imagination). Often the prelude to physical relapse.", zh: "意淫（回忆或幻想），通常是手淫的前奏。" }
    },
    {
        icon: "😌",
        title: { en: "Complacency Relapse", zh: "放松警惕破戒" },
        desc: { en: "Thinking you have succeeded and letting your guard down. 'One slip is enough.'", zh: "以为成功了，一放松警惕就破戒。" }
    },
    {
        icon: "🎉",
        title: { en: "Euphoria Relapse", zh: "狂欢破戒" },
        desc: { en: "Getting carried away when happy or celebrating, leading to indulgence.", zh: "得意忘形时容易放纵，导致破戒。" }
    },
    {
        icon: "🧪",
        title: { en: "Testing Willpower", zh: "试定力破戒" },
        desc: { en: "Deliberately exposing yourself to test if you can handle it. Never do this.", zh: "故意接触黄源试定力，千万不可尝试，必败无疑。" }
    },
    {
        icon: "🌅",
        title: { en: "Morning Wood Relapse", zh: "晨勃破戒" },
        desc: { en: "Touching or dwelling on morning erections leading to loss of control.", zh: "晨勃后触摸或意淫，导致失控破戒。" }
    },
    {
        icon: "⚙️",
        title: { en: "Performance Testing", zh: "试性能力破戒" },
        desc: { en: "Those with PE/ED trying to 'test' if they are healed. Usually ends in failure.", zh: "早泄/阳痿者试图'测试'恢复情况，一试就破。" }
    },
    {
        icon: "🗣️",
        title: { en: "Peer Pressure", zh: "鼓动破戒" },
        desc: { en: "Being led astray by bad friends or visiting inappropriate places.", zh: "被邪友带坏，或去了不良场所。" }
    },
    {
        icon: "🍺",
        title: { en: "Alcohol Relapse", zh: "喝酒破戒" },
        desc: { en: "Alcohol weakens judgment and acts as a catalyst for lust.", zh: "酒是色媒人，酒后乱性，定力大减。" }
    },
    {
        icon: "💧",
        title: { en: "Post-Wet Dream", zh: "遗精后破戒" },
        desc: { en: "The 'chaser effect' after a wet dream makes one easily waver.", zh: "遗精后欲望回潮（追逐效应），容易动摇。" }
    },
    {
        icon: "📅",
        title: { en: "Weekend Relapse", zh: "周末破戒" },
        desc: { en: "Being alone and bored during weekends allows inner demons to arise.", zh: "周末独处无聊，心魔容易趁虚而入。" }
    },
    {
        icon: "💊",
        title: { en: "Supplement Relapse", zh: "补药破戒" },
        desc: { en: "Over-supplementing without mental cultivation increases energy that has nowhere to go.", zh: "盲目进补，不修心，欲火焚身导致破戒。" }
    },
    {
        icon: "🥩",
        title: { en: "Meat Diet Relapse", zh: "吃肉破戒" },
        desc: { en: "Excessive consumption of meat can fuel desire and make control difficult.", zh: "肉食过多助长欲望，增加控制难度。" }
    },
    {
        icon: "📉",
        title: { en: "'Harmlessness' Relapse", zh: "无害论破戒" },
        desc: { en: "Being swayed by the theory that 'masturbation is harmless' and losing motivation.", zh: "被'适度无害论'洗脑，立场动摇。" }
    },
    {
        icon: "👫",
        title: { en: "Girlfriend Relapse", zh: "有女友破戒" },
        desc: { en: "Intimacy requires higher willpower to maintain boundaries.", zh: "有女友对定力要求更高，容易擦枪走火。" }
    },
    {
        icon: "💍",
        title: { en: "Wife Relapse", zh: "有老婆破戒" },
        desc: { en: "Similar to the above, requiring strong mental discipline.", zh: "同样对定力要求极高，需谨慎相处。" }
    },
    {
        icon: "🔄",
        title: { en: "Habitual Relapse", zh: "习惯性破戒" },
        desc: { en: "Relapse becomes a subconscious habit with strong inertia.", zh: "破戒已成习惯，惯性极强，下意识就破了。" }
    },
    {
        icon: "🏖️",
        title: { en: "Holiday Relapse", zh: "假期破戒" },
        desc: { en: "Free time during summer/winter breaks often leads to loss of control.", zh: "寒暑假等长假空闲时间多，容易失控。" }
    },
    {
        icon: "🧘",
        title: { en: "Unorthodox Methods", zh: "邪法破戒" },
        desc: { en: "Practicing PC muscle training or 'enlargement' methods often triggers lust.", zh: "练习PC肌、增大法等旁门左道，极易诱发破戒。" }
    }
];
