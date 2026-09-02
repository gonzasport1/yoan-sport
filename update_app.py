import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the new sport tab
content = content.replace(
    "const sports = ['MLB', 'NFL', 'NBA', 'WNBA', 'NHL', '?? SURVIVOR TOP 20', '? TOP 15 (ÚLTIMOS 7 DÍAS)'];",
    "const sports = ['MLB', 'NFL', 'NBA', 'WNBA', 'NHL', '?? SURVIVOR TOP 20', '?? SURVIVOR (3 MESES)', '? TOP 15 (ÚLTIMOS 7 DÍAS)'];"
)

# Add the isSurvivor3MonthTab logic
content = content.replace(
    "const isKocTab = activeSport === '? TOP 15 (ÚLTIMOS 7 DÍAS)';",
    "const isKocTab = activeSport === '? TOP 15 (ÚLTIMOS 7 DÍAS)';\n  const isSurvivor3MonthTab = activeSport === '?? SURVIVOR (3 MESES)';"
)

# Filter logic
content = content.replace(
    "? picks.filter(p => p.team_specialty === 'Last 7 Days')",
    "? picks.filter(p => p.team_specialty === 'Last 7 Days')\n      : isSurvivor3MonthTab\n        ? picks.filter(p => p.team_specialty === 'Survivor 3 Months')"
)

content = content.replace(
    "&& p.team_specialty !== 'Survivor Contest' && p.team_specialty !== 'Last 7 Days');",
    "&& p.team_specialty !== 'Survivor Contest' && p.team_specialty !== 'Last 7 Days' && p.team_specialty !== 'Survivor 3 Months');"
)
# Note: In previous replace, it was 'King of Covers' -> 'Last 7 Days', so it should just work, but let's be safe:
content = re.sub(
    r"p\.team_specialty !== 'Survivor Contest'[^)]*\)",
    r"p.team_specialty !== 'Survivor Contest' && p.team_specialty !== 'Last 7 Days' && p.team_specialty !== 'Survivor 3 Months')",
    content
)

# Display logic
content = content.replace(
    "? 'CONSENSO DE LEYENDAS SURVIVOR' : isKocTab ? 'CONSENSO TOP 15 (ÚLTIMOS 7 DÍAS)' : 'ALERTA DE CONSENSO TOP 10'",
    "? 'CONSENSO DE LEYENDAS SURVIVOR' : isSurvivor3MonthTab ? 'CONSENSO SURVIVOR (ÚLTIMOS 3 MESES)' : isKocTab ? 'CONSENSO TOP 15 (ÚLTIMOS 7 DÍAS)' : 'ALERTA DE CONSENSO TOP 10'"
)

content = content.replace(
    "? 'concursantes del Survivor' : isKocTab ?",
    "? 'concursantes del Survivor' : isSurvivor3MonthTab ? 'líderes históricos de Survivor de los últimos 3 meses' : isKocTab ?"
)

content = content.replace(
    "{isSurvivorTab ? <Crown size={28} /> : isKocTab ? <Star size={28} /> : <Flame size={28} />}",
    "{isSurvivorTab || isSurvivor3MonthTab ? <Crown size={28} /> : isKocTab ? <Star size={28} /> : <Flame size={28} />}"
)

# Background styling for Survivor 3 Months
content = content.replace(
    "isSurvivorTab ? 'bg-gradient-to-br from-yellow-900/40 to-yellow-600/10 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.15)]'",
    "isSurvivorTab || isSurvivor3MonthTab ? 'bg-gradient-to-br from-yellow-900/40 to-yellow-600/10 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.15)]'"
)

content = content.replace(
    "isSurvivorTab ? 'text-yellow-400' : isKocTab ?",
    "isSurvivorTab || isSurvivor3MonthTab ? 'text-yellow-400' : isKocTab ?"
)

content = content.replace(
    "isSurvivorTab ? 'border-yellow-500/30'",
    "isSurvivorTab || isSurvivor3MonthTab ? 'border-yellow-500/30'"
)
content = content.replace(
    "isSurvivorTab ? 'text-yellow-100'",
    "isSurvivorTab || isSurvivor3MonthTab ? 'text-yellow-100'"
)
content = content.replace(
    "isSurvivorTab ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'",
    "isSurvivorTab || isSurvivor3MonthTab ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'"
)
content = content.replace(
    "isSurvivorTab ? 'text-yellow-400 font-bold'",
    "isSurvivorTab || isSurvivor3MonthTab ? 'text-yellow-400 font-bold'"
)
content = content.replace(
    "isSurvivorTab ? 'border border-yellow-600/30 text-yellow-300'",
    "isSurvivorTab || isSurvivor3MonthTab ? 'border border-yellow-600/30 text-yellow-300'"
)


with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
