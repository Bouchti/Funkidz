import React from 'react';
import { Users, Heart, Award, Target } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] bg-clip-text text-transparent">
              About Us
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bringing joy and creating unforgettable memories for children since 2015
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <img
              src="https://images.unsplash.com/photo-1765947385669-c7614807f61c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
              alt="Happy children"
              className="w-full h-[400px] object-cover rounded-3xl shadow-2xl"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4">
              FunKids Animation started with a simple mission: to make every child's party a magical experience. Founded in 2015 in Brussels, we began with just two entertainers and a passion for bringing joy to children.
            </p>
            <p className="text-gray-700 mb-4">
              Today, we're proud to be Belgium's leading kids' entertainment company, having brought smiles to over 500 parties and thousands of children. Our team of professional entertainers is dedicated to creating unforgettable moments for your special occasions.
            </p>
            <p className="text-gray-700">
              We believe that every child deserves a celebration filled with wonder, laughter, and magic. That's why we continue to innovate and expand our services, always putting the happiness of children and peace of mind of parents first.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center p-8 bg-gradient-to-br from-[var(--fun-orange)]/10 to-[var(--fun-pink)]/10 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--fun-orange)] to-[var(--fun-pink)] flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">15+</h3>
            <p className="text-gray-600">Professional Entertainers</p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-[var(--fun-purple)]/10 to-[var(--fun-blue)]/10 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--fun-purple)] flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">500+</h3>
            <p className="text-gray-600">Successful Events</p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-[var(--fun-blue)]/10 to-[var(--fun-purple)]/10 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--fun-blue)] flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">98%</h3>
            <p className="text-gray-600">Satisfaction Rate</p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-[var(--fun-yellow)]/10 to-[var(--fun-orange)]/10 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--fun-yellow)] to-[var(--fun-orange)] flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">9+</h3>
            <p className="text-gray-600">Years of Experience</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl max-w-3xl mx-auto">
            To create magical, safe, and unforgettable entertainment experiences that bring joy to children and peace of mind to parents, one party at a time.
          </p>
        </div>
      </div>
    </div>
  );
}
