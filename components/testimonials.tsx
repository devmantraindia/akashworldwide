'use client'

import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Small Business Owner',
    content: 'Outstanding service! Got my PAN card processed in just 2 days. Highly recommended!',
    rating: 5,
    avatar: '👨‍💼',
  },
  {
    id: 2,
    name: 'Priya Singh',
    role: 'Student',
    content: 'The entire process was smooth and hassle-free. Great customer support team!',
    rating: 5,
    avatar: '👩‍🎓',
  },
  {
    id: 3,
    name: 'Amit Patel',
    role: 'Entrepreneur',
    content: 'Best platform for all digital services. Very reliable and secure.',
    rating: 5,
    avatar: '👨‍💼',
  },
  {
    id: 4,
    name: 'Deepa Sharma',
    role: 'Professional',
    content: 'Excellent documentation and quick processing. Worth every penny!',
    rating: 5,
    avatar: '👩‍💼',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">What Our Users Say</h2>
          <p className="text-muted-foreground">Join thousands of satisfied customers</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">{testimonial.content}</p>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
