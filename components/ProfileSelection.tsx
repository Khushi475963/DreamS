
import React from 'react';
import { User, Users, Plus, ChevronRight, Phone } from 'lucide-react';
import { IntakeData } from '../types';

interface Props {
  phoneNumber: string;
  existingProfiles: IntakeData[]; // List of unique profiles found for this phone
  onSelectProfile: (profile: IntakeData | null, relationship?: string) => void; // null means "New Profile"
}

const ProfileSelection: React.FC<Props> = ({ phoneNumber, existingProfiles, onSelectProfile }) => {
  
  // Remove duplicates based on fullName just in case
  const uniqueProfiles = existingProfiles.filter((profile, index, self) =>
    index === self.findIndex((p) => (
      p.fullName.toLowerCase() === profile.fullName.toLowerCase()
    ))
  );

  return (
    <div className="flex items-center justify-center min-h-[50vh] animate-fade-in-up">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-full mb-4">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Who is this visit for?</h2>
          <p className="text-slate-500 text-sm mt-2 flex items-center justify-center gap-1">
            Managing health records for <span className="font-semibold text-indigo-600 flex items-center gap-1"><Phone className="w-3 h-3" /> {phoneNumber}</span>
          </p>
        </div>

        <div className="space-y-4">
          
          {/* List Existing Profiles */}
          {uniqueProfiles.length > 0 && (
            <div className="space-y-2 mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Existing Profiles</p>
              {uniqueProfiles.map((profile, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectProfile(profile)}
                  className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm group-hover:bg-indigo-200 group-hover:text-indigo-700 transition-colors">
                      {profile.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{profile.fullName}</h4>
                      <p className="text-xs text-slate-500">{profile.relationship ? `${profile.relationship} • ` : ''}{profile.age} Y • {profile.sex}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
                </button>
              ))}
            </div>
          )}

          {/* New Profile Options */}
          <div className="space-y-3">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {uniqueProfiles.length > 0 ? "Add New Member" : "Select Identity"}
             </p>

             {uniqueProfiles.length === 0 ? (
                <>
                    <button
                        onClick={() => onSelectProfile(null, 'Self')}
                        className="w-full flex items-center gap-4 p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold">For Myself</h4>
                            <p className="text-xs text-indigo-100">Create my main profile</p>
                        </div>
                    </button>

                    <button
                        onClick={() => onSelectProfile(null, '')}
                        className="w-full flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-slate-50 transition-all text-slate-700"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold">For a Family Member</h4>
                            <p className="text-xs text-slate-500">Add child, parent, or spouse</p>
                        </div>
                    </button>
                </>
             ) : (
                <button
                    onClick={() => onSelectProfile(null, '')}
                    className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/10 transition-all font-semibold"
                >
                    <Plus className="w-5 h-5" />
                    Create New Profile
                </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelection;
