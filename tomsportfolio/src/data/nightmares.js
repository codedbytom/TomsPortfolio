export const nightmares = [
      {
        "id": "readpocalypse",
        "title": "📉 Death by 74 Million Read Database Operations",
        "summary": "A client viewing a single survey caused over 74.5 million database reads. Yes, millions.",
        "solution": "Profiled the app using SQL Server Profiler. Identified N+1 queries and overzealous joins.",
        "content": [
          "I was casually checking the profiler logs after a client complained about load time.",
          "A single page view? 74.5 million reads.",
          "Turns out, every related table was being joined, repeatedly, per item in a loop. Nested inside more loops. With no limit. No batching. No caching.",
          "This wasn't an edge case. It was production.",
          //"I documented it. I flagged it. I warned them. But they shrugged. And so, we continue, slowly, bleeding storage I/O on every click.",
          //"The conservative estimate for a client user viewing a survey: 15 dollars PER view"
        ]
      },
      {
        "id": "import-bottleneck",
        "title": "🛑 The Import Bottleneck That Froze the World",
        "summary": "Single row inserts during data imports brought the system to its knees, even for unrelated users.",
        "solution": "Rewrote import logic to use bulk operations. Added isolation to prevent production contention. Deferred non-critical writes.",
        "content": [
          "The import process inserted each row one by one, hundreds, sometimes thousands, directly into production tables.",
          "The result? System-wide slowdowns. Analyst pages froze. Clients couldn't view web pages. Everything spun.",
          "I rewrote the logic to batch inserts using table-valued parameters and ensured it didn't block primary workflows."
        ]
      },
      {
        "id": "non-sargable-phone-cleaner",
        "title": "📞 The Non-SARGable Phone Cleaner",
        "summary": "Phone number comparisons called a SQL function to strip non-numeric characters, inside `WHERE` clauses.",
        "solution": "Moved sanitization to the app layer and enforced normalization on insert. Rewrote queries to use indexed columns and raw comparisons.",
        "content": [
          "The query itself was written to clean phone numbers inline — stripping non-numeric characters inside every `WHERE` clause.",
          "So every time we ran a `SELECT` or `WHERE` clause on a phone number, it called a scalar function to strip out anything that wasn't a digit.",
          "Which meant no indexes. Ever. On phone numbers. Across millions of rows.",
          "I refactored it by sanitizing input during ingestion, storing only digits, and rewriting the logic to compare clean values directly."
        ]
      },
      {
        "id": "next-identifier-roulette",
        "title": "🎲 The Next Identifier Roulette Table",
        "summary": "A custom SQL table was used to manually track IDs, introducing concurrency issues and unnecessary logic.",
        "solution": "Replaced usages with database-generated identities or safe defaults. Reduced object creation overhead and eliminated race conditions.",
        "content": [
          "Instead of using identity columns or GUIDs, the system relied on a custom table called `ltblNextIdentifier`.",
          "Every time an object was created, the code would fetch the next value from this table, increment it, and hope no one else was doing the same.",
          "This introduced race conditions, added database overhead, and was completely avoidable."
        ]
      },
    {
        id: 'downSystem',
        title: "🎱 Symptoms of A Down System",
        summary: "A previous employer's solution for dealing with an unresponsive website for clients and internal users.",
        solution:
            "Difficult, and hard to pinpoint what exactly resolved the system performance. I was able to get the system to stop spinning with multiple database related fixes and optimizations",
        content: [
            "Hired on full time for this company, their first internal dev hire. Always have used contractors to create and deal with their internal systems.",
            "Their lead business person hands me this word document and explains to me what needs to be done if employees or clients complained about spinning when using the websites.",
            "So it went something like this, if there was reports of spinning, the first step was to recycle the app pool in IIS, meaning you had to remote into the production application server and recycle them.",
            "If that didn't work, restart IIS",
            "If that didn't work, restart SQL Server on the database servers",
            "If everyone was still complaining? The Hail Mary, restart all the servers."
        ]
    },
    {
        "id": "qa1-collapse",
        "title": "🧨 The Great QA Collapse",
        "summary": "QA server crashed with a process bypassing source control using Beyond Compare.",
        "solution": "Identified missing `bower_components` and corrupted `lib.js`. Restored correct versions, documented safe deploy practices, and put safeguards in place.",
        "content": [
          "Our QA1 environment suddenly stopped loading any static assets.",
          "Turns out a new process used Beyond Compare to push files manually from the local machine, wiping out `bower_components` and replacing `lib.js` with a 2KB husk.",
          "Nobody knew what happened until I pieced it together hours later, at a bar, when it clicked.",
          "Logged in remotely, restored from a local backup, and got QA1 live again before anyone else even knew what broke."
        ]
      },
      {
        "id": "bad-dev-number-fetch",
        "title": "🔢 The Magic Number Fetcher",
        "summary": "Why default to 0 when you can query the DB for a value you'll overwrite anyway?",
        "solution": "Refactored logic to default to 0. Avoided an unnecessary DB hit every time an object was created.",
        "content": [
          "During object creation, a required numeric field had an unexpected sourcing problem.",
          "Instead of defaulting it, a complex function was written that hit the DB every time to fetch a number that got replaced later.",
          "It added overhead, race conditions, and confusion. All for nothing.",
          "Suggested we just default to 0 and let the DB update it properly, issue gone."
        ]
      },
      // {
      //   "id": "digital-survey-limbo",
      //   "title": "🌀 Digital Survey: The Four-Year Spiral",
      //   "summary": "A nearly complete project stuck in limbo due to shifting priorities and no ownership.",
      //   "solution": "Merged critical branches, resolved edge case bugs, documented final deployment steps — but management never gave the go-ahead.",
      //   "content": [
      //     "Started in 2020. Still not live.",
      //     "Despite being 95% done, Digital Survey kept getting deprioritized every time someone sneezed.",
      //     "I fixed bugs, handled merges, and even built modular client based 'WebPlugins' that would isolation the unique client logic from the core Digital Survey codebase. Every time we were close, new ankle-biters popped up.",
      //     "Eventually, I stopped pushing. Why finish a race when leadership won't let you cross the finish line?"
      //   ]
      // },
      // {
      //   "id": "aws-pipe-dream",
      //   "title": "☁️ The Great AWS Pipe Dream",
      //   "summary": "Two devs. No QA. No CI/CD. But sure, let's promise AWS in three months.",
      //   "solution": "Raised concerns repeatedly. Explained scope and resource gaps. Suggested phased migration with realistic timelines. Ignored.",
      //   "content": [
      //     "An old boss promised a full AWS migration to clients without asking any engineers or hiring anyone with cloud experience.",
      //     "No CI/CD. No DevOps. No PM. No roadmap. No dedicated QA. No documentation on our applications functionality or workflows. Just vibes.",
      //     "I warned them: two devs with no cloud experience can't lift and shift 10+ legacy apps without imploding.",
      //     "They nodded. Then went back to their PowerPoints."
      //   ]
      // },
      // {
      //   "id": "test-script-fantasy",
      //   "title": "🧪 Just Write Some Tests",
      //   "summary": "Boss asked for test scripts... after years of zero guidance or test planning.",
      //   "solution": "Explained that testing needs direction, edge cases, and real use cases, not a vague request thrown over the fence.",
      //   "content": [
      //     "Boss: 'Can you write tests for Digital Survey?'",
      //     "Me: 'What do you want tested?'",
      //     "Boss: 'You know… the usual. Just make it work.'",
      //     "After years of no QA investment, no testing standards, and no documentation, he wanted me to magically know what to test and how. Classic."
      //   ]
      // },
      // {
      //   "id": "client-messaging-stall",
      //   "title": "📨 7 Years of Promises, 0 Delivery",
      //   "summary": "Text-based client messaging sat on the shelf until I solo'd a demo under pressure.",
      //   "solution": "Built it from scratch using Razor, Vonage, and .NET Core backend. Pushed a working MVP. Then... silence from leadership.",
      //   "content": [
      //     "Clients had begged for messaging tools for *years*.",
      //     "Boss talked a big game but never greenlit anything.",
      //     "I built the damn thing in a weekend, with no guidance, no documentation, and no QA support. It worked, showcasing the power of the new tech capabilites of the WebSurvey platform. Clients were excited asking 'Can we use this tomorrow?'. Then? Nothing. No rollout plan. No support. Just inertia.",
      //     "It was a win. But also a warning — leadership doesn't push the last inch."
      //   ]
      // }
];
