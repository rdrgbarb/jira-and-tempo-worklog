import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    jiraBaseUrl: process.env.JIRA_BASE_URL,
    jiraUsername: process.env.JIRA_USER_NAME,
    jiraToken: process.env.JIRA_TOKEN,
    tempoToken: process.env.TEMPO_TOKEN,
    tempoBaseUrl: process.env.TEMPO_BASE_URL,
    authorAccountId: process.env.AUTHOR_ACCOUNT_ID
};