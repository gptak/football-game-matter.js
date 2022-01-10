import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import "./Football.css";

const Football = () => {
  const [aGoalCounter, setAGoalCounter] = useState(0);
  const [bGoalCounter, setBGoalCounter] = useState(0);
  const [winner, setWinner] = useState("");
  const [aWon, setAWon] = useState(false);

  const boxRef = useRef(null);
  const canvasRef = useRef(null);

  const Engine = Matter.Engine;
  const Runner = Matter.Runner;
  const Render = Matter.Render;
  const Events = Matter.Events;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  const Body = Matter.Body;
  const engine = Engine.create({});
  engine.gravity.y = 0;

  const width = 1100;
  const height = 650;
  const goalHeight = height / 4;
  const ballDiameter = 12;
  const playerDiameter = 20;
  let startPosA = 200;
  let startPosB = width - 200;

  aWon ? (startPosA = 200) : (startPosA = width / 2 - 100);
  aWon ? (startPosB = width / 2 + 100) : (startPosB = width - 200);

  const playerA = Bodies.circle(startPosA, height / 2, playerDiameter, {
    restitution: 0,
    render: {
      fillStyle: "blue",
      strokeStyle: "black",
      lineWidth: 2,
    },
  });
  Body.setMass(playerA, 2.5);

  const playerB = Bodies.circle(startPosB, height / 2, playerDiameter, {
    restitution: 0,
    render: {
      fillStyle: "red",
      strokeStyle: "black",
      lineWidth: 2,
    },
  });
  Body.setMass(playerB, 2.5);

  const ball = Bodies.circle(width / 2, height / 2, ballDiameter, {
    restitution: 0.5,
    render: {
      fillStyle: "white",
      strokeStyle: "black",
      lineWidth: 2,
    },
  });
  Body.setMass(ball, 1);

  const playerAGoal = Bodies.rectangle(10, height / 2, 20, goalHeight, {
    isSensor: true,
    isStatic: true,
    render: {
      fillStyle: "transparent",
    },
  });

  const playerBGoal = Bodies.rectangle(width - 10, height / 2, 20, goalHeight, {
    isSensor: true,
    isStatic: true,
    render: {
      fillStyle: "transparent",
    },
  });

  const wallUp = Bodies.rectangle(width / 2, -50, width, 100, {
    restitution: 0,
    isStatic: true,
  });

  const wallDown = Bodies.rectangle(width / 2, height + 50, width, 100, {
    restitution: 0,
    isStatic: true,
  });

  const wallLeft = Bodies.rectangle(-50, height / 2, 100, height + 200, {
    restitution: 0,
    isStatic: true,
    friction: 1,
  });

  const wallRight = Bodies.rectangle(
    width + 50,
    height / 2,
    100,
    height + 200,
    {
      restitution: 0,
      isStatic: true,
      friction: 1,
    }
  );

  const band1 = Bodies.rectangle(
    0,
    (height - goalHeight) / 4,
    80,
    (height - goalHeight) / 2,
    {
      restitution: 0,
      isStatic: true,
      render: {
        fillStyle: "#0b490b",
        strokeStyle: "black",
        lineWidth: 3,
      },
    }
  );
  const band2 = Bodies.rectangle(
    0,
    (3 * height + goalHeight) / 4,
    80,
    (height - goalHeight) / 2,
    {
      restitution: 0,
      isStatic: true,
      render: {
        fillStyle: "#0b490b",
        strokeStyle: "black",
        lineWidth: 3,
      },
    }
  );

  const goalSignA = Bodies.rectangle(
    20,
    (height - goalHeight) / 2 - 20,
    20,
    20,
    {
      restitution: 0,
      isStatic: true,
      render: {
        fillStyle: "transparent",
        strokeStyle: "black",
        lineWidth: 1,
      },
    }
  );

  const goalSignB = Bodies.rectangle(
    width - 20,
    (height - goalHeight) / 2 - 20,
    20,
    20,
    {
      restitution: 0,
      isStatic: true,
      render: {
        fillStyle: "transparent",
        strokeStyle: "black",
        lineWidth: 1,
      },
    }
  );

  const band3 = Bodies.rectangle(
    width,
    (height - goalHeight) / 4,
    80,
    (height - goalHeight) / 2,
    {
      restitution: 0,
      isStatic: true,
      render: {
        fillStyle: "#0b490b",
        strokeStyle: "black",
        lineWidth: 3,
      },
    }
  );
  const band4 = Bodies.rectangle(
    width,
    (3 * height + goalHeight) / 4,
    80,
    (height - goalHeight) / 2,
    {
      restitution: 0,
      isStatic: true,
      render: {
        fillStyle: "#0b490b",
        strokeStyle: "black",
        lineWidth: 3,
      },
    }
  );

  useEffect(() => {
    checkScore();
  });

  useEffect(() => {
    const render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: width,
        height: height,
        background: "#169416",
        wireframes: false,
      },
    });

    World.add(engine.world, [
      wallUp,
      wallDown,
      wallLeft,
      wallRight,
      playerAGoal,
      playerBGoal,
      band1,
      band2,
      band3,
      band4,
      playerA,
      playerB,
      ball,
      goalSignA,
      goalSignB,
    ]);

    Runner.run(engine);
    Render.run(render);
  });

  // players movement and shooting

  const moveForce = 0.0004;
  const shootForce = 0.0005;

  const keyHandlers = {
    KeyD: () => {
      Body.applyForce(
        playerA,
        {
          x: playerA.position.x,
          y: playerA.position.y,
        },
        { x: moveForce, y: 0 }
      );
    },
    KeyA: () => {
      Body.applyForce(
        playerA,
        {
          x: playerA.position.x,
          y: playerA.position.y,
        },
        { x: -moveForce, y: 0 }
      );
    },
    KeyW: () => {
      Body.applyForce(
        playerA,
        {
          x: playerA.position.x,
          y: playerA.position.y,
        },
        { x: 0, y: -moveForce }
      );
    },
    KeyS: () => {
      Body.applyForce(
        playerA,
        {
          x: playerA.position.x,
          y: playerA.position.y,
        },
        { x: 0, y: moveForce }
      );
    },
    ArrowRight: () => {
      Body.applyForce(
        playerB,
        {
          x: playerB.position.x,
          y: playerB.position.y,
        },
        { x: moveForce, y: 0 }
      );
    },
    ArrowLeft: () => {
      Body.applyForce(
        playerB,
        {
          x: playerB.position.x,
          y: playerB.position.y,
        },
        { x: -moveForce, y: 0 }
      );
    },
    ArrowUp: () => {
      Body.applyForce(
        playerB,
        {
          x: playerB.position.x,
          y: playerB.position.y,
        },
        { x: 0, y: -moveForce }
      );
    },
    ArrowDown: () => {
      Body.applyForce(
        playerB,
        {
          x: playerB.position.x,
          y: playerB.position.y,
        },
        { x: 0, y: moveForce }
      );
    },
    KeyQ: () => {
      if (
        Math.abs(playerA.position.x - ball.position.x) < 45 &&
        Math.abs(playerA.position.y - ball.position.y) < 45
      ) {
        Body.applyForce(
          ball,
          {
            x: ball.position.x,
            y: ball.position.y,
          },
          {
            x: shootForce * (ball.position.x - playerA.position.x),
            y: shootForce * (ball.position.y - playerA.position.y),
          }
        );
      }
    },
    KeyP: () => {
      if (
        Math.abs(playerB.position.x - ball.position.x) <
          ballDiameter + playerDiameter + 10 &&
        Math.abs(playerB.position.y - ball.position.y) <
          ballDiameter + playerDiameter + 10
      ) {
        Body.applyForce(
          ball,
          {
            x: ball.position.x,
            y: ball.position.y,
          },
          {
            x: shootForce * (ball.position.x - playerB.position.x),
            y: shootForce * (ball.position.y - playerB.position.y),
          }
        );
      }
    },
  };

  const keysDown = new Set();

  document.addEventListener("keydown", (event) => {
    keysDown.add(event.code);
  });

  document.addEventListener("keyup", (event) => {
    keysDown.delete(event.code);
  });

  Events.on(engine, "beforeUpdate", () => {
    [...keysDown].forEach((key) => {
      keyHandlers[key]?.();
    });
  });

  // goals handler

  Events.on(engine, "collisionStart", (e) => {
    let pairs = e.pairs;

    for (let i = 0, j = pairs.length; i !== j; ++i) {
      let pair = pairs[i];

      if (pair.bodyA === ball && pair.bodyB === playerAGoal) {
        goalSignA.render.fillStyle = "yellow";

        setTimeout(() => {
          setAGoalCounter(aGoalCounter + 1);

          setAWon(false);
        }, 1000);
      } else if (pair.bodyA === ball && pair.bodyB === playerBGoal) {
        goalSignB.render.fillStyle = "yellow";
        setTimeout(() => {
          setBGoalCounter(bGoalCounter + 1);

          setAWon(true);
        }, 1000);
      }
    }
  });

  const checkScore = () => {
    if (aGoalCounter >= 2) {
      setWinner("Red");
    } else if (bGoalCounter >= 2) {
      setWinner("Blue");
    } else {
      setWinner("");
    }
  };

  const playAgain = () => {
    setAGoalCounter(0);
    setBGoalCounter(0);
  };

  return (
    <div className="football">
      <header className="title">
        <h1>Football Game</h1>
      </header>
      <div className="scoreboard">
        <span>{bGoalCounter}</span>
        <span> : </span>
        <span>{aGoalCounter}</span>
      </div>
      {winner === "" ? (
        <div ref={boxRef} className="box">
          <canvas ref={canvasRef} />
        </div>
      ) : (
        <div className="result">
          <h2 className="result_message"><span className={winner}>{winner}</span> won!</h2>
          <button onClick={playAgain}>Play again</button>
        </div>
      )}
    </div>
  );
};

export default Football;