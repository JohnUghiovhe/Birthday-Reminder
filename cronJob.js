const schedule = require('node-schedule');
const { getBirthdayUsers } = require('./database');
const { sendBirthdayEmails } = require('./emailService');

// Schedule job to run every day at 7:00 AM
const birthdayJob = schedule.scheduleJob('0 7 * * *', async function() {
  console.log('Running birthday check at', new Date().toISOString());
  
  try {
    const birthdayUsers = getBirthdayUsers();
    
    if (birthdayUsers.length === 0) {
      console.log('No birthdays today!');
      return;
    }
    
    console.log(`Found ${birthdayUsers.length} birthday(s) today!`);
    console.log('Sending birthday emails...');
    
    const results = await sendBirthdayEmails(birthdayUsers);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`Birthday emails sent: ${successful} successful, ${failed} failed`);
    
    if (failed > 0) {
      console.log('Failed emails:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.user}: ${r.error}`);
      });
    }
  } catch (error) {
    console.error('Error in birthday cron job:', error);
  }
});

console.log('Birthday reminder cron job scheduled to run daily at 7:00 AM');

module.exports = birthdayJob;

