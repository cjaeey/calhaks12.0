import { Hammer } from "lucide-react";

export function Footer() {
  const footerSections = [
    {
      title: "BuildMatch",
      links: ["About", "Contact", "Careers"],
    },
    {
      title: "For Customers",
      links: ["Post a Job", "Track a Project"],
    },
    {
      title: "For Professionals",
      links: ["Create Profile", "Verify License"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms"],
    },
  ];

  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="mb-4 text-lg">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          {/* Logo and Tagline */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Hammer className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">
                  AI that builds trust between people who build things.
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-400 text-center md:text-right">
              <p className="mb-2">Powered by</p>
              <p>Fetch.ai • Anthropic • Bright Data • ChromaDB</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>© 2025 BuildMatch | Built with Fetch.ai, Anthropic, Bright Data, ChromaDB</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
