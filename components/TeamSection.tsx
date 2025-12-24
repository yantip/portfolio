interface TeamMember {
  role: string
  names: string[]
}

interface TeamSectionProps {
  team: TeamMember[]
}

export default function TeamSection({ team }: TeamSectionProps) {
  if (!team || !Array.isArray(team) || team.length === 0) {
    return null
  }

  return (
    <section className="border-t border-neutral-200 pt-12 mt-16">
      <div className="flex items-center gap-2 mb-10">
        <h2 className="text-2xl font-semibold">Team</h2>
        <span className="text-2xl">↓</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
        {team.map((member, index) => (
          <div key={index}>
            <h3 className="font-semibold text-base mb-2 pb-2 border-b border-neutral-200">
              {member.role}
            </h3>
            <ul className="space-y-1">
              {member.names && member.names.map((name, nameIndex) => (
                <li key={nameIndex} className="text-neutral-600 text-base">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
