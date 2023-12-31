import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Fox from "../models/Fox";
import Loader from "../components/Loader";
import useAlert from "../hooks/useAlert";
import Alert from "../components/Alert";

const Contact = () => {
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnimation, setCurrentAnimations] = useState("idle");

  const { alert, showAlert, hideAlert } = useAlert();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = () => {
    setCurrentAnimations("walk");
  };
  const handleBlur = () => {
    setCurrentAnimations("idle");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentAnimations("hit");

    try {
      // Your Formspree endpoint
      const formspreeEndpoint = "https://formspree.io/f/mgejbkqr";

      // Create form data
      const formData = new FormData(formRef.current);

      // Make a POST request to Formspree
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setIsLoading(false);
        showAlert({
          show: true,
          text: "Message sent successfully",
          type: "success",
        });

        setTimeout(() => {
          hideAlert();
          setCurrentAnimations("idle");
          setForm({ name: "", email: "", message: "" });
        }, 4000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      setIsLoading(false);
      setCurrentAnimations("idle");
      console.error(error);
      showAlert({
        show: true,
        text: "I didn't receive your message",
        type: "danger",
      });
    }
  };
  return (
    <section className="relative flex lg:flex-row flex-col max-container">
      {alert.show && <Alert {...alert} />}
      <div className="flex-1 min-w-[50%] flex flex-col">
        <h1 className="head-text">Get in Touch</h1>

        <form
          ref={formRef}
          className="w-full flex flex-col gap-7 mt-14"
          onSubmit={handleSubmit}
        >
          <label className="text-black-500 font-semibold text-2xl">
            Name
            <input
              type="text"
              name="name"
              className="input"
              placeholder="Enter your name"
              required
              value={form.name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>

          <label className="text-black-500 font-semibold text-2xl">
            Email
            <input
              type="email"
              name="email"
              className="input"
              placeholder="Enter your email"
              required
              value={form.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>

          <label className="text-black-500 font-semibold text-2xl">
            Your Message
            <textarea
              name="message"
              rows={4}
              className="textarea"
              placeholder="Let me Know how can I help you!"
              required
              value={form.message}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>

          <button
            type="submit"
            className="btn"
            disabled={isLoading}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      <div className="lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]">
        <Canvas camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}>
          <directionalLight intensity={2.5} position={[0, 0, 1]} />
          <ambientLight intensity={0.5} />
          <Suspense fallback={<Loader />}>
            <Fox
              currentAnimation={currentAnimation}
              position={[0.5, 0.35, 0]}
              rotation={[12.6, -0.6, 0]}
              scale={[0.5, 0.5, 0.5]}
            />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
};

export default Contact;
