import { Shield, Clock, Plane, Tag, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Book flights with confidence through our secure payment system',
    color: 'text-blue-600',
    bgColor: 'bg-white/80'
  },
  {
    icon: Tag,
    title: 'Competitive Prices',
    description: 'We offer some of the best flight prices with our price match guarantee',
    color: 'text-indigo-600',
    bgColor: 'bg-white/80'
  },
  {
    icon: Plane,
    title: 'Wide Selection',
    description: 'Access hundreds of airlines and routes to destinations worldwide',
    color: 'text-purple-600',
    bgColor: 'bg-white/80'
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Our flight booking experts are available around the clock',
    color: 'text-teal-600',
    bgColor: 'bg-white/80'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with multiple gradients for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#f0f7ff_0%,#e8f3ff_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_50%_0%,#fff_0%,transparent_100%)]" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(100%_100%_at_0%_50%,#e1edff_0%,transparent_100%)]" />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(100%_100%_at_100%_50%,#e1edff_0%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-700 font-semibold text-sm uppercase tracking-wider">Why Book With Us</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Flight Booking Made Simple
          </h2>
          <p className="mt-6 text-xl text-gray-600">
            Our streamlined flight booking service helps you find and secure the best flights
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group"
            >
              <div className="h-full p-6 sm:p-8 rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 border border-blue-100 hover:border-blue-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-blue-100">
                <div className={`inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 rounded-xl bg-gradient-to-b from-${feature.color.split('-')[1]}-500/10 to-${feature.color.split('-')[1]}-500/5 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 sm:w-8 h-6 sm:h-8 ${feature.color}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-8 border-t border-blue-100">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600 text-sm">
            <span className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-700" />
              Secure Payment Processing
            </span>
            <span className="flex items-center">
              <Plane className="w-5 h-5 mr-2 text-blue-700" />
              Over 450 Airlines
            </span>
            <span className="flex items-center">
              <Tag className="w-5 h-5 mr-2 text-blue-700" />
              Best Price Guarantee
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Add these styles to your global CSS file
/*
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
*/