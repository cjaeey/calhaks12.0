'use client';

import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Star, MapPin, CheckCircle, ExternalLink } from 'lucide-react';
import type { Match } from '../lib/api';

interface MatchResultsProps {
  matches: Match[];
}

export function MatchResults({ matches }: MatchResultsProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">No matches found. Try posting another project with different requirements.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl mb-8 text-center">
        Top {matches.length} Matches for Your Project
      </h2>

      <div className="space-y-6">
        {matches.map((match, index) => (
          <motion.div
            key={match.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl mb-2">{match.name}</h3>
                  <div className="flex items-center gap-3 text-gray-600 mb-2">
                    <span className="font-semibold text-blue-600">{match.trade}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {match.city}, {match.state}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold px-6 py-3 rounded-lg text-center">
                    {match.score}
                    <div className="text-xs font-normal opacity-90">/ 100</div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mb-4">
                {match.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{match.rating.toFixed(1)}</span>
                  </div>
                )}

                <Badge variant="outline" className="capitalize">
                  {match.price_band} pricing
                </Badge>

                {match.license && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Licensed</span>
                  </div>
                )}
              </div>

              {/* Services */}
              {match.services && match.services.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Services:</div>
                  <div className="flex flex-wrap gap-2">
                    {match.services.map((service, idx) => (
                      <Badge key={idx} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Reasoning */}
              {match.reason && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="text-sm font-semibold text-blue-900 mb-2">
                    Why this match:
                  </div>
                  <p className="text-sm text-blue-800">{match.reason}</p>
                </div>
              )}

              {/* Concerns */}
              {match.concerns && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="text-sm font-semibold text-yellow-900 mb-2">
                    Note:
                  </div>
                  <p className="text-sm text-yellow-800">{match.concerns}</p>
                </div>
              )}

              {/* Website Link */}
              {match.website && (
                <a
                  href={match.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
