'use client';
import Link from 'next/link';
import { useEffect } from 'react';

// interface Message {
//   id: number;
//   message: string;
// }

export default function Home() {
  // const [status, setStatus] = useState<boolean | null>(null);
  // const [menu, setMenu] = useState<any>(null);
  // const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
      
  }, []);


  return (
    <div>
      <h1>MySQL Database Connection Status</h1>
      {/* {status == null ? (
        <p className="text-indigo-400 font-semibold">
          Checking database connection...
        </p>
      ) : status == false ? (
        <p className="text-red-400 font-semibold">
          Failed to fetch connection status.
        </p>
      ) : status == true ? (
        <p className="text-emerald-400 font-semibold">
          Database Connected Successfully..!!
        </p>
      ) : (
        ''
      )} */}

      {/* <h2>Messages from Database:</h2>
      <ul>
        {messages?.map((msg: any) => (
          <li className="font-semibold text-sky-700" key={msg.edited_by}>
            {msg.edited_by} - {msg.created_date}
          </li>
        ))}
      </ul> */}

      <Link href={'/menuList'} type="button" className="primary-btn">
            Go to Menu
      </Link>
    </div>
  );
}
