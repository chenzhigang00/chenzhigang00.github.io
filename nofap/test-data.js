const testData = [
    {
        id: 1,
        type: "text",
        question: {
            zh: "你对适度无害论的态度和理解。",
            en: "What is your attitude and understanding towards the theory of 'moderation is harmless'?"
        }
    },
    {
        id: 2,
        type: "radio",
        question: {
            zh: "出现憋精情况时，你会选择：",
            en: "When experiencing sperm retention (holding back ejaculation), you would choose to:"
        },
        options: [
            { value: "A", text: { zh: "憋", en: "Hold it in" } },
            { value: "B", text: { zh: "射掉", en: "Ejaculate" } }
        ]
    },
    {
        id: 3,
        type: "text",
        question: {
            zh: "遗精后应该注意什么？",
            en: "What should you pay attention to after a nocturnal emission (wet dream)?"
        }
    },
    {
        id: 4,
        type: "text",
        question: {
            zh: "破戒类型有哪些？",
            en: "What are the types of relapse?"
        }
    },
    {
        id: 5,
        type: "text",
        question: {
            zh: "导致遗精的因素有哪些？",
            en: "What factors lead to nocturnal emissions?"
        }
    },
    {
        id: 6,
        type: "text",
        question: {
            zh: "断意淫口诀是什么？",
            en: "What is the mantra for cutting off lustful thoughts?"
        }
    },
    {
        id: 7,
        type: "text",
        question: {
            zh: "什么是欲望休眠期？",
            en: "What is the 'dormant period of desire'?"
        }
    },
    {
        id: 8,
        type: "text",
        question: {
            zh: "什么是戒断反应，具体有哪些？",
            en: "What is withdrawal syndrome, and what are the specific symptoms?"
        }
    },
    {
        id: 9,
        type: "text",
        question: {
            zh: "遇见诱惑时正确的第一反应是什么？",
            en: "What is the correct immediate reaction when encountering temptation?"
        }
    },
    {
        id: 10,
        type: "text",
        question: {
            zh: "什么是正确的戒色动机？",
            en: "What is the correct motivation for NoFap?"
        }
    },
    {
        id: 11,
        type: "radio",
        question: {
            zh: "意淫的变化规律：",
            en: "The pattern of change in lustful thoughts:"
        },
        options: [
            { value: "A", text: { zh: "随着时间变强", en: "Strengthens over time" } },
            { value: "B", text: { zh: "随着时间变弱", en: "Weakens over time" } }
        ]
    },
    {
        id: 12,
        type: "text",
        question: {
            zh: "手淫导致腰痛的原因？",
            en: "Why does masturbation cause lower back pain?"
        }
    },
    {
        id: 13,
        type: "text",
        question: {
            zh: "手淫导致腿软的原因？",
            en: "Why does masturbation cause weak legs?"
        }
    },
    {
        id: 14,
        type: "text",
        question: {
            zh: "为什么撸管的人胆子会变小？",
            en: "Why do people who masturbate tend to become timid?"
        }
    },
    {
        id: 15,
        type: "text",
        question: {
            zh: "手淫为什么会导致脱发和白发？",
            en: "Why does masturbation cause hair loss and premature graying?"
        }
    },
    {
        id: 16,
        type: "text",
        question: {
            zh: "撸管后为什么睾丸容易下垂？",
            en: "Why do testicles tend to sag after masturbation?"
        }
    },
    {
        id: 17,
        type: "text",
        question: {
            zh: "戒色时你是否可以控制自己的情绪，是否能管理自己的情绪。",
            en: "Can you control and manage your emotions during NoFap?"
        }
    },
    {
        id: 18,
        type: "text",
        question: {
            zh: "手淫为什么会导致脑力下降？",
            en: "Why does masturbation lead to a decline in mental power (brain fog)?"
        }
    },
    {
        id: 19,
        type: "text",
        question: {
            zh: "手淫为什么会导致鼻炎或者加重鼻炎？",
            en: "Why does masturbation cause or aggravate rhinitis?"
        }
    },
    {
        id: 20,
        type: "text",
        question: {
            zh: "如何克服戒色厌倦期？",
            en: "How to overcome the period of boredom/fatigue in NoFap?"
        }
    },
    {
        id: 21,
        type: "text",
        question: {
            zh: "为什么手淫后会变得嗜卧懒动，哈欠连天？",
            en: "Why do you become lethargic, lazy, and yawn constantly after masturbation?"
        }
    },
    {
        id: 22,
        type: "text",
        question: {
            zh: "出现晨勃时，应该如何对待？",
            en: "How should you deal with morning erections?"
        }
    },
    {
        id: 23,
        type: "text",
        question: {
            zh: "如何克服梦撸？",
            en: "How to overcome masturbation during sleep/dreams?"
        }
    },
    {
        id: 24,
        type: "text",
        question: {
            zh: "手淫为什么会使人变丑？",
            en: "Why does masturbation make one appear less attractive?"
        }
    },
    {
        id: 25,
        type: "text",
        question: {
            zh: "光看不撸是否有危害？",
            en: "Is there any harm in watching pornography without masturbating (edging)?"
        }
    },
    {
        id: 26,
        type: "text",
        question: {
            zh: "哪些念头是心魔的怂恿？",
            en: "Which thoughts are incitements from the 'inner demon'?"
        }
    },
    {
        id: 27,
        type: "text",
        question: {
            zh: "为什么意淫要在第一时间断掉？",
            en: "Why must lustful thoughts be cut off immediately?"
        }
    },
    {
        id: 28,
        type: "text",
        question: {
            zh: "精液的正常颜色是？",
            en: "What is the normal color of semen?"
        }
    },
    {
        id: 29,
        type: "text",
        question: {
            zh: "久坐和熬夜的危害是？",
            en: "What are the harms of sedentary behavior and staying up late?"
        }
    },
    {
        id: 30,
        type: "text",
        question: {
            zh: "意淫的危害是什么？",
            en: "What are the harms of lustful thoughts/fantasizing?"
        }
    },
    {
        id: 31,
        type: "text",
        question: {
            zh: "进入戒色稳定期的标志是什么？",
            en: "What are the signs of entering the stable period of NoFap?"
        }
    },
    {
        id: 32,
        type: "text",
        question: {
            zh: "为何肾虚后大小便容易出问题？",
            en: "Why do urinary and bowel issues often occur after kidney deficiency?"
        }
    },
    {
        id: 33,
        type: "text",
        question: {
            zh: "为何手淫的人容易自卑？",
            en: "Why are people who masturbate prone to low self-esteem?"
        }
    },
    {
        id: 34,
        type: "text",
        question: {
            zh: "撸管为什么会导致耳鸣？",
            en: "Why does masturbation cause tinnitus (ringing in the ears)?"
        }
    },
    {
        id: 35,
        type: "text",
        question: {
            zh: "靠什么降伏心魔？",
            en: "What do you rely on to subdue the 'inner demon'?"
        }
    }
];
