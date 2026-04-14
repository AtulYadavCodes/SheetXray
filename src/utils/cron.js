import cron from 'node-cron';
cron.schedule("0 00 */1 * *",async()=>{
        console.log("cron job running");
    })
//runs every day to update the users subscription status