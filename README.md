# jira-and-tempo-worklog

## Setup:

### Configure your local .env
Configure your local .env file accordingly with the example file: `.env.example`.

#### api-token
    Generate your api-token [here](https://id.atlassian.com/manage-profile/security/api-tokens).

    See further at [official Atlassian docs](https://support.atlassian.com/statuspage/docs/create-and-manage-api-keys/)

## How to run:

### 1 - Edit your local file worklog.csv.

- CSV format:
```csv
issue;time;comment;startTime;startDate;timeType;activityType;capexOpex
```

- Example below:
```csv
STARS-1780;30m;Daily - Sprint 34;09:00:00;2023-11-07;CommonHour;Rituals;CAPEX_STARS
STARS-1743;2h;Technical Refinement of Intentional Architecture;10:00:00;2023-11-08;CommonHour;RitosRituals;CAPEX_STARS
STARS-1778;150m;Meetings, Tech Support - Sprint 34;14:30:00;2023-11-08;HoraComum;Others;CAPEX_STARS
GOAT-11;1h;Architecture - App integration;17:30:00;2023-11-09;HoraComum;Others;CAPEX_GOAT
```

> [!IMPORTANT]
> There's an unsolved bug with partial timing, like 1h30m. So, the .csv works with full slots, such as 150m or 5h.

### 2 - Run this code in your command line:

- Current day:
```bash
tsc; node ./src/index.js
```

- Specific day:
```bash
tsc; node ./src/index.js 2023-09-29
```
