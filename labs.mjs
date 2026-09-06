import {labs,runLab} from './labs.js';
const unit=Number(process.argv[2]||1),scenario=Number(process.argv[3]||0);
try{
  const result=runLab(unit,scenario,process.argv.slice(4).join(' ')||'Where do notes save?');
  console.log(labs.find(lab=>lab.unit===unit).title);
  console.log(JSON.stringify(result,null,2));
}catch(error){console.error(error.message);process.exitCode=1;}
