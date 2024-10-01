'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [paragraphVisible, setParagraphVisible] = useState(false);
  const [typingFinished, setTypingFinished] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'How can I help you learn more about Ian and his experience?',
    },
  ]);

  const submitForm = async (e) => {
    e.preventDefault();

    // Add the user's message to the messages array
    let newMessages = [...messages, { role: 'user', content: messageInput }];
    setMessages(newMessages);
    setMessageInput(''); // Clear input field

    // Limit conversation history to a manageable number (e.g., the last 5 exchanges)
    const limitedMessages = newMessages.slice(-6); // Includes last 5 exchanges + system message

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: limitedMessages }), // Send only the limited messages
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const apiMessage = await response.json();
      console.log('API Response:', apiMessage); // Log the API response

      // Add the AI response to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'system', content: apiMessage.message },
      ]);
    } catch (error) {
      console.error('Error fetching API:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'system',
          content: 'Error fetching response. Please try again.',
        },
      ]);
    }
  };

  useEffect(() => {
    // Dynamically load TagCanvas from the local public directory
    const loadTagCanvas = async () => {
      const script = document.createElement('script');
      script.src = '/js/tagcanvas.min.js'; // Path to your local file in the public folder
      script.onload = () => {
        if (document.getElementById('tagcanvas')) {
          try {
            TagCanvas.Start('tagcanvas', 'taglist', {
              textColour: '#11fa11da',
              outlineColour: 'white',
              reverse: true,
              depth: 0.2,
              maxSpeed: 0.05,
              minSpeed: 0.01,
              initial: [0.1, -0.1],
              weight: true,
              weightMode: 'size',
              wheelZoom: true,
            });
          } catch (e) {
            console.log('TagCanvas error:', e);
            document.getElementById('tagcanvas').style.display = 'none';
          }
        }
      };
      document.body.appendChild(script);
    };

    // Load the TagCanvas script once the component is mounted
    loadTagCanvas();

    // Set a timer to show the paragraph after the typing animation completes
    const timer = setTimeout(() => {
      setParagraphVisible(true);
    }, 3500); // Set delay time to match the typing animation duration

    return () => clearTimeout(timer); // Clean up the timer when the component unmounts
  }, []);

  useEffect(() => {
    // Set a timer to show the paragraph and remove caret after typing finishes
    const typingDuration = 3500; // Duration of the typing animation
    setTimeout(() => {
      setParagraphVisible(true); // Show paragraph after typing finishes
      setTypingFinished(true); // Mark typing as finished to remove caret
    }, typingDuration);
  }, []);

  const toggleMobileMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <>
      <body>
        <header>
          <a href="#" className="logo-holder">
            <div className="logo">IM</div>
            <div className="logo-text">Portfolio Website</div>
          </a>
          <nav>
            <ul id="menu" className={menuOpen ? 'active' : ''}>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#skills">Skills</a>
              </li>
              <li>
                <a href="#projects">Projects</a>
              </li>
              <li>
                <a href="#chatbot">Chat</a>
              </li>
              <li>
                <a
                  href="mailto:iancmann99@gmail.com"
                  target="_blank"
                  className="button header"
                >
                  Let's Talk
                </a>
              </li>
            </ul>

            <a href="#" className="mobile-toggle" onClick={toggleMobileMenu}>
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M5 7h14M5 12h14M5 17h14"
                />
              </svg>
            </a>
          </nav>
        </header>
        <main>
        <section className="hero container">
            <div className="hero-left">
              <div>
                {/* Typing effect */}
                <h1>
                <span className={`typing ${typingFinished ? 'finished' : ''}`}>
                    <small>Hello I'm </small> Ian Mann
                  </span>
                </h1>

                {/* Paragraph that appears after typing finishes */}
                <p className={paragraphVisible ? 'visible' : 'hidden'}>
                  A passionate full-stack developer with a knack for visualizing
                  and creating interactive websites and applications. I thrive
                  in dynamic environments where innovation and creativity are
                  key. Additionally I am always looking to grow my developer knowledge and aim to learn as much as possible about 
                  technologies such as machine learning and neural networks.
                </p>
                <div className="call-to-action">
                  <a
                    href="/assets/Ian Mann Resume 1 9_26.pdf"
                    target="_blank"
                    className="button white"
                  >
                    View Resume
                  </a>
                  <a
                    href="mailto:iancmann99@gmail.com"
                    target="_blank"
                    className="button"
                  >
                    Contact Me
                  </a>
                </div>
                <div className="social-links">
                  <a href="https://github.com/ianmannn" target="_blank">
                    <img src="/assets/githubwhite.png" alt="GitHub" width="48px" />
                  </a>
                  <a href="https://www.linkedin.com/in/iancmann99/" target="_blank">
                    <img
                      src="/assets/linkedinwhite.png"
                      alt="LinkedIn"
                      width="48px"
                    />
                  </a>
                  <a href="https://www.nextlevel-dash.com/" target="_blank">
                    <img
                      src="/assets/nllargelogo.png"
                      alt="NextLevel"
                      width="48px"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="hero-right">
              <img
                src="/assets/linkprofpic4cut.png"
                alt="Ian Mann"
                width="100%"
                height="80%"
              />
            </div>
          </section>
          <section className="logos container">
            <div className="marquee">
              <div className="track">
                <img src="/assets/html.png" alt="HTML" width="128" />
                <img src="/assets/css.png" alt="CSS" width="128" />
                <img
                  src="/assets/javascript.png"
                  alt="Javascript"
                  width="128"
                />
                <img src="/assets/sass.png" alt="SASS" width="128" />
                <img src="/assets/react.png" alt="React" width="128" />
                <img src="/assets/nextjs.png" alt="NextJS" width="128" />
                <img src="/assets/vscode.png" alt="VSCode" width="128" />
                <img src="/assets/express2.png" alt="ExpressJS" width="128" />
                <img src="/assets/node.png" alt="NodeJS" width="128" />
                <img src="/assets/redux.png" alt="Redux" width="128" />
                <img src="/assets/git.png" alt="Git" width="128" />
                <img src="/assets/html.png" alt="HTML" width="128" />
                <img src="/assets/css.png" alt="CSS" width="128" />
                <img
                  src="/assets/javascript.png"
                  alt="Javascript"
                  width="128"
                />
                <img src="/assets/sass.png" alt="SASS" width="128" />
                <img src="/assets/react.png" alt="React" width="128" />
                <img src="/assets/nextjs.png" alt="NextJS" width="128" />
                <img src="/assets/vscode.png" alt="VSCode" width="128" />
                <img src="/assets/express2.png" alt="ExpressJS" width="128" />
                <img src="/assets/node.png" alt="NodeJS" width="128" />
                <img src="/assets/redux.png" alt="Redux" width="139" />
                <img src="/assets/git.png" alt="Git" width="128" />
              </div>
            </div>
          </section>
          <section id="skills" className="skills container">
            <h2>
              <small> About me</small>
              Skills
            </h2>
            <div className="about-holder">
            <div className="about-left">
                <canvas id="tagcanvas" width="400" height="400">
                  Your browser does not support the canvas element.
                </canvas>

                <ul id="taglist" style={{ display: 'none' }}>
                  <li>
                    <a href="https://tinyurl.com/3pmr22tm" target="_blank">
                      JAVASCRIPT
                    </a>
                  </li>
                  <li>
                    <a href="https://tinyurl.com/4h5p9m8t" target="_blank">
                      REACT
                    </a>
                  </li>
                  <li>
                    <a href="https://tinyurl.com/4ahfkfaf" target="_blank">
                      NEXT.JS
                    </a>
                  </li>
                  <li>
                    <a href="https://tinyurl.com/yc2fdc7v" target="_blank">
                      AWS
                    </a>
                  </li>
                  <li>
                    <a href="https://tinyurl.com/yc44mck2" target="_blank">
                      MONGODB
                    </a>
                  </li>
                  <li>
                    <a href="https://tinyurl.com/bdhhyr64" target="_blank">
                      EXPRESS.JS
                    </a>
                  </li>
                  <li>
                    <a href="https://tinyurl.com/y2b2f85c" target="_blank">
                      HTML
                    </a>
                  </li>
                  <li>
                    <a href="https://tinyurl.com/4j3asmep" target="_blank">
                      CSS
                    </a>
                  </li>
                  <li>
                    <a href="https://tinyurl.com/4pyp29yc" target="_blank">
                      REDUX
                    </a>
                  </li>
                  <li>
                    <a href="https://tinyurl.com/mxv9s5wf" target="_blank">
                      TYPESCRIPT
                    </a>
                  </li>
                  <li>
                    <a href="https://tinyurl.com/233kkrw4" target="_blank">
                      SASS
                    </a>
                  </li>
                  <li>
                    <a href="https://tinyurl.com/5n8b2r22" target="_blank">
                      JIRA
                    </a>
                  </li>
                  <li>
                    <a href="https://tinyurl.com/y4ec6h8v" target="_blank">
                      POSTGRESQL
                    </a>
                  </li>
                </ul>
              </div>
              <div className="about-right">
                <h3>Frontend</h3>
                <ul>
                  <li>REACT</li>
                  <li>HTML</li>
                  <li>CSS</li>
                  <li>TYPESCRIPT</li>
                  <li>NEXT</li>
                  <li>REDUX</li>
                  <li>GIT</li>
                  <li>SASS</li>
                </ul>
                <h3>Backend</h3>
                <ul>
                  <li>NODE</li>
                  <li>EXPRESS</li>
                  <li>SQL & NOSQL</li>
                  <li>AWS</li>
                  <li>JIRA</li>
                  <li>+ MORE</li>
                </ul>
              </div>
            </div>
          </section>
          <section id="chatbot" className="chatbot container">
            <h2>
              <small> Talk to me </small>
              Chatbot
            </h2>
            <div className="chatbot-main">
              <div className="chat-info">
                <h3> Ask Away</h3>
                <p>
                  I've created a chatbot which knows all about my skills and
                  experience. It also has a copy of my CV/Resume. You can use it
                  to ask questions about me to getter a better idea of who I am
                  and what I've done!
                </p>
                <p>
                  You are also able to download my resume here in PDF form if
                  you are interested and want to take a look.
                </p>
                <a
                  href="/assets/Ian Mann Resume 1 9_26.pdf"
                  target="_blank"
                  className="button white"
                >
                  Download Resume
                </a>
              </div>
              <div className="chat-box">
                <div className="scroll-area">
                  <ul id="chat-log">
                    {messages.map((message, index) => (
                      <li key={index} className={`${message.role}`}>
                        <span className={`avatar`}>
                          {message.role === 'user' ? 'You' : 'AI'}
                        </span>
                        <div className="message">{message.content}</div>
                      </li>
                    ))}
                  </ul>
                </div>
                <form onSubmit={submitForm} className="chat-message">
                  <input
                    type="text"
                    placeholder="Hey Ian, what skills are you best at?"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <button className="send-button">Send</button>
                </form>
              </div>
            </div>
          </section>
        </main>
      </body>
    </>
  );
}
