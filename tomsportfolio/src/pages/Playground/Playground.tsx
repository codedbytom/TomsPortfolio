import React, {useState} from 'react';

const Playground: React.FC = () => {
    const [value, setValue] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        //console.log(value);
        alert(("This is a test"));
    };

    const secondButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        alert("This is a second button");
    };
    const thirdButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        alert("This is a third button");
    };
    return (
        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">🧪 TypeScript Playground</h1>
          <input
            type="text"
            value={value}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
          />
          <p className="mt-2 text-gray-600">Typed value: {value}</p>
          <p>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded" onClick={handleSubmit}>
                Submit
            </button>
          </p>
          <p>
          <button className="bg-blue-500 text-white p-2 rounded" onClick={secondButtonClick}>
            Second Button
          </button>
          </p>
          <p>
          <button className="bg-blue-500 text-white p-2 rounded" onClick={thirdButtonClick}>
            Third Button
          </button>
          </p>
        </div>
      );
    };
    export default Playground;