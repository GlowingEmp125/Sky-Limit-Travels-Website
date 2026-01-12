const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Travel Enthusiast',
    content: 'The best travel experience I\'ve ever had. The attention to detail and customer service was exceptional.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3',
    location: 'Bali Adventure, 2024',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Adventure Seeker',
    content: 'They made planning my trip so easy. Everything was perfectly organized and the destinations were amazing.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
    location: 'Swiss Alps Tour, 2024',
    rating: 5
  },
  {
    name: 'Emma Wilson',
    role: 'Digital Nomad',
    content: 'I\'ve booked multiple trips through them and each one has been fantastic. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3',
    location: 'Thailand Retreat, 2024',
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50" aria-labelledby="testimonials-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 
            id="testimonials-title"
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 mb-4"
          >
            Traveler Stories That Inspire
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of satisfied adventurers who've discovered their dream destinations with us
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="relative bg-white rounded-2xl shadow-xl p-8 transition-transform hover:-translate-y-1"
              itemScope 
              itemType="https://schema.org/Review"
            >
              <div className="absolute -top-4 right-8 bg-yellow-400 text-white px-4 py-1 rounded-full">
                {"★".repeat(testimonial.rating)}
              </div>
              
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={`${testimonial.name}'s profile picture`}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-50"
                />
                <div className="ml-4">
                  <h3 className="font-bold text-lg" itemProp="author">{testimonial.name}</h3>
                  <p className="text-blue-600">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
              
              <blockquote>
                <div className="relative">
                  <span className="absolute -top-4 -left-2 text-5xl text-blue-200">"</span>
                  <p className="text-gray-600 italic relative z-10 pl-4" itemProp="reviewBody">
                    {testimonial.content}
                  </p>
                </div>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}