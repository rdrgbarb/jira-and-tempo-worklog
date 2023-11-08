import axios from 'axios';
import { PathLike } from 'fs';
import fs from 'fs/promises';
import ms from 'ms';
import { format } from 'date-fns';
import { config } from './config';

// Configurações
const jiraCredentials = `${config.jiraUsername}:${config.jiraToken}`;
const jiraAuthToken = Buffer.from(jiraCredentials).toString('base64');

const jiraHttpConfig = {
  headers: {
    Authorization: `Basic ${jiraAuthToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

const tempoHttpConfig = {
  headers: {
    Authorization: `Bearer ${config.tempoToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

const saveWorklog = async (data: { authorAccountId: string; description: string; issueId: number; startDate:string; startTime:string; timeSpentSeconds: number}) => {  
  try {
    let url = `${config.tempoBaseUrl}/worklogs`;
    console.log('saveWorklog url:',url);

    const response = await axios.post(
      url,
      data,
      tempoHttpConfig
    );
    console.log('Horas registradas com sucesso:', response.data);
  } catch (error: any) {
    console.error('Erro ao registrar horas:', error);
  }
};

const getIssueId = async (issueKey: string) : Promise<number> =>  {
  try {
    console.log('Processing issueKey:', issueKey);
    let url = `${config.jiraBaseUrl}/issue/${issueKey}`;
    const response = await axios.get(
      url,
      jiraHttpConfig
    );
    console.log('Retrieved issueId:', response.data.id);
    return response.data.id;
  } catch (error: any) {
    console.error('getIssueId error:', error.response.data);
    console.error('http status:', error.response.status);
    throw new Error('Error retrieving IssueId');
  }
};

const processCSV = async (filePath: PathLike | fs.FileHandle, dateFromArgs: string) => {
  try {
    const defaultStartTime = '09:30:00';
    let defaultDate = format(new Date(), "yyyy-MM-dd");
    if (dateFromArgs) {
      defaultDate = dateFromArgs;
    }
    const csvData = await fs.readFile(filePath, 'utf-8');
    const lines = csvData.trim().split('\n');

    for (const line of lines) {
      if (!line.startsWith('#') && line.trim().length > 0) {
        const values = line.split(';');
        
        let issueId = 0;
        getIssueId(values[0]).then((value) => {
          issueId = value;
          const timeSpentSeconds: number = +`${ms(values[1]) / 1000}`;
        
          const description:string = values[2];
          
          const startTimeFromCsv = values[3];
          let startTime:string = defaultStartTime;
          if(startTimeFromCsv) {
            startTime = startTimeFromCsv;
          }

          const dateFromCsv = values[4];
          let startDate:string = defaultDate;
          if(dateFromCsv) {
            startDate = dateFromCsv
          }

          const timeType = values[5];
          const activityType = values[6];
          const capexOpex = values[7];

          const extraAttributes = [
            {
              key: '_Account_',
              value: capexOpex
            },
            {
              key: '_TipodeHora_',
              value: timeType
            },
            {
              key: '_TipodeAtividade_',
              value: activityType
            }
          ]

          let authorAccountId:string = config.authorAccountId ? config.authorAccountId : 'xpto';

          const data = {
            authorAccountId,
            description,
            issueId,
            startDate,
            startTime,
            timeSpentSeconds,
            attributes: extraAttributes
          };

          console.log(data);
          
          saveWorklog(data);
          
        });
        
      }
    }
  } catch (error) {
    console.error('Erro ao processar o arquivo CSV:', error);
  }
};


const csvFilePath = 'worklog.csv';
const date = process.argv[2];

processCSV(csvFilePath, date);
