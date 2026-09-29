"use client";

import { Avatar, AvatarGroup } from "@/components/motion/avatar";

// Free Unsplash portraits, loaded from Unsplash and cropped to the face.
const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=160&h=160&fit=crop&crop=faces&auto=format&q=80`;

const TEAM = [
  { name: "Maya Ross", id: "1494790108377-be9c29b29330" },
  { name: "Leo Park", id: "1500648767791-00dcc994a43e" },
  { name: "Ana Silva", id: "1580489944761-15a19d654956" },
  { name: "Sam Cole", id: "1507003211169-0a1dd7228f2d" },
  { name: "Iris Chen", id: "1607503873903-c5e95f80d7b9" },
  { name: "Tom Hale", id: "1624395213043-fa2e123b2656" },
];

export function AvatarPreview() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-end gap-4">
        <Avatar size="sm" src={photo(TEAM[0].id)} alt={TEAM[0].name} fallback="MR" status="online" />
        <Avatar src={photo(TEAM[1].id)} alt={TEAM[1].name} fallback="LP" status="away" />
        <Avatar size="lg" src={photo(TEAM[2].id)} alt={TEAM[2].name} fallback="AS" status="busy" />
        {/* A broken image falls back to initials. */}
        <Avatar size="lg" src="/does-not-exist.png" fallback="AK" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <AvatarGroup max={4}>
          {TEAM.map((person) => (
            <Avatar key={person.id} src={photo(person.id)} alt={person.name} fallback={person.name.slice(0, 2)} />
          ))}
        </AvatarGroup>
        <p className="text-xs text-muted-foreground">Hover the group to fan it out.</p>
      </div>
    </div>
  );
}
