// =============================================
// FILE: src/components/Features.jsx
// PURPOSE: Showcases the 3 core features as cards
// =============================================

// Define the feature data in an array — easy to add more later
const features = [
  {
    id: 1,
    icon: "📄",
    title: "AI Resume Review",
    description:
      "Upload your resume and get instant, actionable feedback powered by AI. Identify gaps, improve wording, and tailor it for the role you want.",
  },
  {
    id: 2,
    icon: "🎙️",
    title: "AI Mock Interviews",
    description:
      "Practice real technical and behavioral interview questions in a simulated environment. Get scored answers and tips after every session.",
  },
  {
    id: 3,
    icon: "📊",
    title: "Progress Dashboard",
    description:
      "Track your improvement over time with a visual dashboard. See which topics you've mastered and where to focus next.",
  },
];

function Features() {
  return (
    // Section with id for navbar anchor link
    <section className="features" id="features">

      {/* Section header */}
      <div className="features-header">
        <p className="features-eyebrow">WHAT WE OFFER</p>
        <h2 className="features-title">Everything you need to get hired</h2>
        <p className="features-subtitle">
          Three powerful tools, one streamlined platform.
        </p>
      </div>

      {/* Cards container — uses flexbox to lay out 3 cards in a row */}
      <div className="features-grid">
        {/* .map() loops over the features array and renders a card for each */}
        {features.map((feature) => (
          <div className="feature-card" key={feature.id}>
            {/* Icon at the top of each card */}
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>

    </section>
  );
}

export default Features;
