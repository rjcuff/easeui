"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/motion/accordion";

const QUESTIONS = [
  {
    value: "install",
    question: "How do I add a component?",
    answer: "Run the shadcn add command from any component page. The source file lands in your project, ready to edit.",
  },
  {
    value: "motion",
    question: "Does it respect reduced motion?",
    answer: "Yes. Every animation turns off when the operating system asks for reduced motion.",
  },
  {
    value: "license",
    question: "Can I use it in commercial work?",
    answer: "Yes. easeUI is MIT licensed, so you can use it in personal and commercial projects.",
  },
];

export function AccordionPreview() {
  return (
    <Accordion defaultValue={["install"]} className="w-full max-w-sm">
      {QUESTIONS.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
