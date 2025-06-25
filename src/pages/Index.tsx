
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const courseTopics = [
    {
      title: "Foundations of UX Design",
      description: "Understanding user-centered design principles and the UX process"
    },
    {
      title: "Empathize & Define",
      description: "User research methods and problem definition techniques"
    },
    {
      title: "Ideate & Design",
      description: "Creative ideation and wireframing fundamentals"
    },
    {
      title: "Prototype & Test",
      description: "Building interactive prototypes and conducting usability tests"
    },
    {
      title: "Responsive Web Design",
      description: "Creating adaptive designs for all screen sizes"
    },
    {
      title: "UX Research",
      description: "Advanced research methodologies and data analysis"
    },
    {
      title: "Portfolio Development",
      description: "Showcasing UX work and professional presentation"
    }
  ];

  const flipCards = [
    {
      front: {
        title: "Course Overview",
        content: "7 comprehensive modules covering the complete UX design process from research to final presentation"
      },
      back: {
        title: "My Learning Journey",
        content: "Completed 180+ hours of hands-on learning with real-world projects and case studies"
      }
    },
    {
      front: {
        title: "Skills Gained",
        content: "User research, wireframing, prototyping, usability testing, and responsive design principles"
      },
      back: {
        title: "Projects Completed",
        content: "3 end-to-end UX projects including mobile app design and e-commerce website redesign"
      }
    },
    {
      front: {
        title: "Tools Mastered",
        content: "Figma, Adobe XD, Miro, Maze, and various prototyping and research tools"
      },
      back: {
        title: "Real Impact",
        content: "Improved user satisfaction by 40% in final project through iterative design and testing"
      }
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % courseTopics.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + courseTopics.length) % courseTopics.length);
  };

  const toggleFlip = (index: number) => {
    setFlippedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-fade-in">
            Mastering UX Design
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-fade-in">
            My Google UX Design Certificate Journey
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto animate-fade-in">
            Explore the comprehensive 7-module program that transformed my approach to user-centered design
          </p>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Course Topics
        </h2>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {courseTopics.map((topic, index) => (
                <div key={index} className="w-full flex-shrink-0 p-12 text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{index + 1}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{topic.title}</h3>
                  <p className="text-gray-600 max-w-md mx-auto">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {courseTopics.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Flip Cards Section */}
      <section className="container mx-auto px-6 py-16 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Course Insights
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {flipCards.map((card, index) => (
            <div key={index} className="relative h-64 perspective-1000">
              <div 
                className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                  flippedCards.includes(index) ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front Side */}
                <Card className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{card.front.title}</h3>
                      <p className="text-gray-600">{card.front.content}</p>
                    </div>
                    <Button 
                      onClick={() => toggleFlip(index)}
                      className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      About My Experience
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Back Side */}
                <Card className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{card.back.title}</h3>
                      <p className="text-gray-600">{card.back.content}</p>
                    </div>
                    <Button 
                      onClick={() => toggleFlip(index)}
                      variant="outline"
                      className="w-full mt-4"
                    >
                      Back to Course Info
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Key Achievements
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-6 bg-white shadow-lg border-0">
            <CardContent className="p-0">
              <div className="text-4xl font-bold text-blue-500 mb-2">180+</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hours of Learning</h3>
              <p className="text-gray-600">Intensive hands-on coursework covering all aspects of UX design</p>
            </CardContent>
          </Card>
          
          <Card className="p-6 bg-white shadow-lg border-0">
            <CardContent className="p-0">
              <div className="text-4xl font-bold text-purple-500 mb-2">3</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Portfolio Projects</h3>
              <p className="text-gray-600">End-to-end UX projects from research to final prototype</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Ready to See My Work?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Explore my complete UX portfolio and case studies
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg"
          >
            View Portfolio <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">© 2024 UX Design Journey. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
