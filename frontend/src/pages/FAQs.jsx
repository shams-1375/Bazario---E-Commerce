import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const questions = [
    { q: "What is the warranty on Bazario products?", a: "All our electronics come with a standard 1-year manufacturer warranty from the date of purchase." },
    { q: "How long does delivery usually take?", a: "For metro cities, we deliver within 2-3 business days. For other regions, it might take 5-7 business days." },
    { q: "Can I return a product if I don't like it?", a: "Yes! We have a 30-day return policy. The product must be in its original packaging and unused." },
    { q: "Do you offer Cash on Delivery (COD)?", a: "Yes, we offer COD for orders below ₹10,000 across most pin codes in India." }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {questions.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 text-left font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              >
                {item.q}
                {activeIndex === index ? <ChevronUp className="text-teal-600" /> : <ChevronDown className="text-gray-400" />}
              </button>
              {activeIndex === index && (
                <div className="p-5 pt-0 text-gray-600 bg-white leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;