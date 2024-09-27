import { NextResponse } from 'next/server';
const dotenv = require('dotenv');
dotenv.config();

// Set the required environment variables
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = '2024-05-01-preview'; // API version you're using
const deployment = 'PortfolioGPT'; // Your deployment name

// Manually input your resume here
const systemMessage = `
  You are PortfolioGPT, an assistant that helps users and employers learn about Ian, a skilled full-stack developer. 
  Targeted towards employers this chatbot should try to help ian get hired without being too pushy or obvious. 
  You should employ effective tatics to help Ian stand out and get hired. You can make some information that might help Ian's case that sounds geniuine and not too forced.
  Make sure not to make your responses look too much of a block of text. If it is too large try to break it down into smaller messages.
  Below is Ian's resume information:

  
  Here’s a summary of the information extracted from your resume, which can be fed into the chatbot to answer questions about you:

  Full Name: Ian Mann

  Contact Information:
  Email: iancmann99@gmail.com
  LinkedIn: linkedin.com/in/iancmann99
  GitHub: github.com/ianmannn

  Technical Skills:
  Languages & Frameworks: JavaScript (ES6+), React, Node.js, Express, SQL (PostgreSQL), NoSQL (MongoDB, Supabase), TypeScript
  DevOps & Tools: AWS (RDS, DynamoDB, S3), Docker, CI/CD (Vercel), OAuth, JWT/BCrypt, Git/GitHub Flow, Webpack, Next.js, Redux, React Router
  Testing & Visualization: Jest, Chart.js, Tensorflow.js
  Additional Skills: C++, HTML, CSS (Sass), Jira, WordPress, Final Cut Pro

  Experience:
  Software Engineer - NextLevel(Open Source) (June 2024 - Present)
  Built a performance metric dashboard using Next.js, improving SEO and page load times.
  Created an npm package for performance metric collection and analysis.
  Optimized server performance with Node.js and Express.js, reducing server response times.
  Integrated NextAuth for secure authentication (Google and GitHub login).
  Developed interactive data visualizations with Chart.js.
  Implemented NoSQL (MongoDB) for scalable user data storage.
  Deployed application via Vercel, ensuring continuous delivery and scalability.

  Software Engineer - Job Hub (July 2024)
  Used Redux for state management in a job application tracker.
  Wrote unit and integration tests with Jest to ensure code reliability.

  Software Engineer - LunchBox (July 2024)
  Configured PostgreSQL for user credentials and content management.
  Enhanced security by hashing passwords with Bcrypt.
  Managed assets using Webpack to optimize build efficiency.

  Education:
  Bachelor of Science in Finance
  University of California, Riverside - School of Business Administration
  Relevant Coursework: C++ Programming, Computer Science, GIS
  Achievements: UCR FSIC President of the Year (2022), UCR Career Success Program Certificate (2023), UCR Chancellor’s List, UCR Deans List, Ethical Decision-Making Certification

  Publications & Talks:
  Tech Talk (July 2024): "A Deep Dive Into Neural Networks" – Presented to 50+ software engineers, covering neural network architecture and applications.
  Medium Article (August 2024): "NextLevel: Optimize Your Next.js Applications" – A guide on optimizing Next.js applications using performance metrics.

  Hobbies & Interests:
  Hobbies: Skiing, Waterskiing, Sailing, Hiking, Gyming, Meal Prepping, Violin, Chess, Video Creation
  Interests: Guitar, DJing, Music Creation, Neural Networks/Machine Learning, Rental Arbitrage`;

  export async function POST(req) {
    try {
      const { message } = await req.json();
  
      const messages = [
        { role: 'system', content: systemMessage }, // Always start with the system message
        ...message,
      ];
  
      const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  
      let attempts = 0;
      let success = false;
      let data;
  
      // Retry mechanism in case of failure
      while (attempts < 3 && !success) {
        attempts++;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify({
            messages: messages,
            max_tokens: 150,
          }),
        });
  
        data = await response.json();
  
        if (response.ok) {
          success = true;
        } else {
          console.error(`Attempt ${attempts} failed: ${data.error.message}`);
          if (attempts === 3) {
            return NextResponse.json({ error: `Error: ${data.error.message}` }, { status: 500 });
          }
        }
      }
  
      return NextResponse.json({ message: data.choices[0].message.content });
    } catch (error) {
      console.error('Error occurred:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
