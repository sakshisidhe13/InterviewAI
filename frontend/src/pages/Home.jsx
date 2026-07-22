// =============================================
// FILE: src/pages/Home.jsx
// PURPOSE: The Home page — assembles all section components in order
// =============================================

// Import each section component
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";

function Home() {
  return (
    // A wrapper div that holds the full page layout
    <div className="page">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
