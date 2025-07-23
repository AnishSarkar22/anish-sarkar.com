import { AnimatePresence, motion } from "motion/react";
const SendEmailButton = () => {
  const email = "anishsarkar282@gmail.com";
  const mailtoLink = `mailto:${email}`;

  return (
    <motion.a
      href={mailtoLink}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 1.05 }}
      className="relative px-1 py-4 text-sm text-center rounded-full font-extralight bg-primary w-[12rem] cursor-pointer overflow-hidden inline-block"
      style={{ textDecoration: "none" }}
    >
      <AnimatePresence mode="wait">
        <motion.p
          className="flex items-center justify-center gap-2"
          key="copy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <img src="/assets/send-mail.svg" className="w-5" alt="send icon" style={{ transform: "rotate(-30deg)" }} />
          Mail Me
        </motion.p>
      </AnimatePresence>
    </motion.a>
      );
};

export default SendEmailButton;