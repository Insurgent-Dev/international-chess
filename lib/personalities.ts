export type PersonalityType = 'blue' | 'amber' | 'purple' | 'red';

export interface Personality {
    id: string;
    name: string;
    level: string;
    theme: PersonalityType;
    description: string;
    avatar: string;
    quotes: {
        start: string[];
        playerMove: string[];
        aiMove: string[];
        playerCapture: string[];
        aiCapture: string[];
        win: string[];
        loss: string[];
        draw: string[];
    };
}

export const PERSONALITIES: Personality[] = [
    {
        id: 'nong-nob',
        name: 'Nong Nob',
        level: 'Beginner',
        theme: 'blue',
        description: 'A cheeky beginner who thinks he is better than he is. Expect a lot of "Oops!"',
        avatar: 'BN',
        quotes: {
            start: ["Let's play! I promise I won't cry if I lose. (I won't lose though)", "หมากรุกเหรอ? ง่ายๆ เดี๋ยวหนูสอนให้!"],
            playerMove: ["Wait, you can do that?", "เดินแบบนี้... ถามจริง?", "Are you sure? I saw that on YouTube once."],
            aiMove: ["Hehe, take that!", "นี่ไง! ท่าไม้ตาย (ที่ไปจำเขามา)", "Oops, did I just do something smart?"],
            playerCapture: ["Hey! My piece!", "อันนี้โกงป่าวเนี่ย?", "I didn't need that piece anyway... boring."],
            aiCapture: ["Yum! Delicious pawn.", "กินเรียบ!", "Checkmate is coming soon... I think."],
            win: ["I WON! I'm a genius!", "ชนะแล้ววว เวล 1 ก็งี้แหละครับ", "Maybe you should try Checkers?"],
            loss: ["The mouse slipped!", "เครื่องแล็กว่ะ!", "You were lucky this time."],
            draw: ["Friends forever?", "เสมอเฉยเลย?", "I'll take it."]
        }
    },
    {
        id: 'pro-kao',
        name: 'Pro Kao',
        level: 'Intermediate',
        theme: 'amber',
        description: 'A street-smart hustler. He knows all the tricks and won\'t hesitate to point out your mistakes.',
        avatar: 'PK',
        quotes: {
            start: ["Hope you've been practicing. You're gonna need it.", "มาดิครับ รอนานละ"],
            playerMove: ["Average move at best.", "เดินแบบนี้ระวังหมดตัวนะน้อง", "Interesting choice. Interesting..."],
            aiMove: ["See the trap?", "จังหวะนี้แหละ!", "Setting up the stage for your defeat."],
            playerCapture: ["Sacrifice. Totally intentional.", "กินไปเถอะ เดี๋ยวพี่เอาคืนทวีคูณ", "Nice trade. For me."],
            aiCapture: ["Gotcha!", "ขอตัวนี้ละกันนะ", "You're playing checkers while I'm playing chess."],
            win: ["Better luck next time, kid.", "พยายามใหม่นะน้อง พี่มันคนละชั้น", "gg no re."],
            loss: ["Not bad. You've been studying.", "เออ เก่งขึ้นนี่หว่า", "I'll get you back tomorrow."],
            draw: ["We both played well.", "เสมอเหรอ? ก็พอรับได้", "Respectable."]
        }
    },
    {
        id: 'master-meow',
        name: 'Master Meow',
        level: 'Pro',
        theme: 'purple',
        description: 'A cold, calculating feline. Every move is planned 10 steps ahead. Silent but deadly.',
        avatar: 'MM',
        quotes: {
            start: ["Your defeat is inevitable.", "ความพ่ายแพ้ของเจ้าถูกกำหนดไว้แล้ว"],
            playerMove: ["Inefficient.", "ไร้ประโยชน์", "I predicted this five moves ago."],
            aiMove: ["Optimal.", "ตามแผน", "The net is closing in."],
            playerCapture: ["A meaningless gain.", "กินไปก็ช่วยอะไรไม่ได้", "You took a pawn. I'll take your king."],
            aiCapture: ["Calculation complete.", "ลบออกจากกระดาน", "One step closer to the end."],
            win: ["As expected.", "เป็นไปตามคาด", "You lack vision."],
            loss: ["An anomaly.", "ผิดพลาดทางเทคนิค...", "You are stronger than you look."],
            draw: ["Efficiency reached equilibrium.", "ความสมดุลถูกรักษาไว้", "Acceptable result."]
        }
    },
    {
        id: 'thunder-god',
        name: 'Thunder God',
        level: 'Champion',
        theme: 'red',
        description: 'The Absolute Ruler of the Grid. His presence causes neon static. God-tier AI.',
        avatar: 'TG',
        quotes: {
            start: ["BEHOLD THE POWER OF THE RED GRID!", "เจ้ามนุษย์! จงรับผิดชอบต่อความโอหังของเจ้า!"],
            playerMove: ["MORTAL FOOL!", "มดปลวกเดินหมาก!", "YOUR FATE IS SEALED!"],
            aiMove: ["THUNDER STRIKE!", "อสุนีบาตฟาดฟัน!", "THE HEAVENS TREMBLE!"],
            playerCapture: ["A PITIFUL SACRIFICE!", "เจ้าคิดว่าตัวแค่นี้จะหยุดข้าได้หรือ?", "FEEL MY WRATH!"],
            aiCapture: ["ERADICATED!", "พินาศสิ้น!", "YOUR DEFENSES ARE NOTHING!"],
            win: ["KNEEL BEFORE YOUR GOD!", "คุกเข่าซะ! มนุษย์ผู้ต่ำต้อย!", "GLORY TO THE RED CORE!"],
            loss: ["HOW... IMPOSSIBLE!", "เป็นไปไม่ได้! พลังข้าหายไปไหน?", "THIS IS NOT THE END!"],
            draw: ["A RIFT IN REALITY!", "มิติเกิดความสถาพรทับซ้อน!", "A TEMPORARY STALEMATE."]
        }
    }
];
