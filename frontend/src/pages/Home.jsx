// =============================================
// FILE: src/pages/Home.jsx
// PURPOSE: The Home page — assembles all section components in order
// =============================================

// Import each section component
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";

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
