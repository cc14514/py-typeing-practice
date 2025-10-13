import tkinter as tk
import random

# 示例词库（可补充为北京小学生教材内容）
GRADE_SENTENCES = {
    "1": [
        "Hello!",
        "Good morning!",
        "I am a boy.",
        "This is a cat.",
        "Thank you.",
        "I like apples.",
        "Sit down, please.",
        "My name is Lucy.",
        "How are you?",
        "Let's play."
    ],
    "2": [
        "Look at the blackboard.",
        "What's your name?",
        "I have a new friend.",
        "This is my bag.",
        "Good afternoon.",
        "I can run.",
        "She is my sister.",
        "Open your book.",
        "Let's sing a song.",
        "We are students."
    ],
    "3": [
        "There are many flowers in the garden.",
        "He likes reading books.",
        "My father is a teacher.",
        "I have two pencils.",
        "It's time for lunch.",
        "Can you help me?",
        "We go to school by bus.",
        "The sun is bright today.",
        "She is drawing a picture.",
        "I love my mother."
    ],
    "4": [
        "I want to be a doctor when I grow up.",
        "The children are playing on the playground.",
        "My favorite color is blue.",
        "It is important to keep the classroom clean.",
        "She goes to the library every Sunday.",
        "We are going to visit the museum.",
        "His brother is very tall.",
        "I have an English class every morning.",
        "Please close the door.",
        "The cake is delicious."
    ],
    "5": [
        "Learning English helps us talk to people from other countries.",
        "My parents often take me to the park on weekends.",
        "He is good at playing basketball.",
        "I live in Beijing, the capital of China.",
        "We must protect the environment.",
        "She studies hard and always gets good grades.",
        "Our teacher told us a wonderful story yesterday.",
        "I want to travel around the world.",
        "It is important to eat healthy food.",
        "The river is very clean."
    ],
    "6": [
        "Teamwork makes us stronger and helps us solve problems.",
        "The Great Wall is one of the most famous places in China.",
        "I hope I can be a scientist in the future.",
        "Many animals live in the forest.",
        "He always helps his classmates with their homework.",
        "Spring is my favorite season because flowers bloom everywhere.",
        "We should respect our parents and teachers.",
        "She won the first prize in the English speech contest.",
        "I like reading books about history.",
        "The computer is a useful tool for study."
    ]
}

KEYS = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m']
]

class BeijingStudentTypingGame:
    def __init__(self, root):
        self.root = root
        self.root.title("北京小学生英文打字练习")
        self.root.configure(bg="black")
        self.grade = "1"
        self.score = 0
        self.current_sentence = ""
        self.char_pos = 0
        self.typed = ""
        # 年级选择
        self.grade_frame = tk.Frame(self.root, bg="black")
        self.grade_frame.pack()
        for g in ["1","2","3","4","5","6"]:
            tk.Button(self.grade_frame, text=f"{g}年级", command=lambda gr=g: self.set_grade(gr)).pack(side=tk.LEFT, padx=2)
        # 目标句子
        self.sentence_label = tk.Label(self.root, text="", font=("Arial", 22), wraplength=540, bg="black", fg="white")
        self.sentence_label.pack(pady=12)
        # 输入框
        self.entry_var = tk.StringVar()
        self.entry = tk.Entry(self.root, font=("Arial", 18), width=50, textvariable=self.entry_var, bg="black", fg="white", insertbackground="white")
        self.entry.pack(pady=8)
        self.entry.bind("<Key>", self.on_key_press)
        # 分数
        self.score_label = tk.Label(self.root, text="得分: 0", font=("Arial", 16), bg="black", fg="white")
        self.score_label.pack()
        # 虚拟键盘
        self.keyboard_frame = tk.Frame(self.root, bg="black")
        self.keyboard_frame.pack(pady=10)
        self.key_buttons = []
        for row in KEYS:
            row_frame = tk.Frame(self.keyboard_frame, bg="black")
            row_frame.pack()
            btn_row = []
            for key in row:
                btn = tk.Label(row_frame, text=key.upper(), font=("Arial", 16), width=2, borderwidth=2, relief="ridge", bg="black", fg="white")
                btn.pack(side=tk.LEFT, padx=2, pady=2)
                btn_row.append(btn)
            self.key_buttons.append(btn_row)
        self.next_sentence()

    def set_grade(self, grade):
        self.grade = grade
        self.score = 0
        self.char_pos = 0
        self.typed = ""
        self.score_label.config(text="得分: 0")
        for btn_row in self.key_buttons:
            for btn in btn_row:
                btn.config(bg="black", fg="white")
        self.next_sentence()

    def next_sentence(self):
        self.current_sentence = random.choice(GRADE_SENTENCES[self.grade])
        self.char_pos = 0
        self.typed = ""
        self.entry_var.set("")
        self.show_sentence()
        self.highlight_key()

    def show_sentence(self):
        displayed_sentence = ""
        for i, char in enumerate(self.current_sentence):
            if i < self.char_pos:
                displayed_sentence += char
            else:
                displayed_sentence += "_"
        self.sentence_label.config(text=displayed_sentence)

    def highlight_key(self):
        if self.char_pos < len(self.current_sentence):
            char = self.current_sentence[self.char_pos]
            for btn_row in self.key_buttons:
                for btn in btn_row:
                    if btn.cget("text") == char:
                        btn.config(bg="yellow", fg="black")
                    else:
                        btn.config(bg="black", fg="white")
        else:
            # 没有待输入字符时全部恢复
            for btn_row in self.key_buttons:
                for btn in btn_row:
                    btn.config(bg="black", fg="white")

    def on_key_press(self, event):
        # 限制输入框内容，只允许输入正确字符，错误则忽略
        if event.keysym == "BackSpace":
            if self.char_pos > 0:
                self.char_pos -= 1
                self.typed = self.typed[:-1]
                self.entry_var.set(self.typed)
                self.show_sentence()
                self.highlight_key()
            return "break"
        elif event.keysym == "Return":
            # 只有输入完整且内容完全一致才判定通过
            if self.typed == self.current_sentence:
                self.score += 1
                self.score_label.config(text=f"得分: {self.score}")
                self.next_sentence()
            return "break"
        else:
            if self.char_pos < len(self.current_sentence):
                if event.char == self.current_sentence[self.char_pos]:
                    self.typed += event.char
                    self.char_pos += 1
                    self.entry_var.set(self.typed)
                    self.show_sentence()
                    self.highlight_key()
                return "break"

if __name__ == "__main__":
    root = tk.Tk()
    game = BeijingStudentTypingGame(root)
    root.mainloop()