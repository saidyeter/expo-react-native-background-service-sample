import { Button, Text, View } from "react-native";
import BackgroundService from 'react-native-background-actions';
const myURL = 'https://3126109b333a.ngrok-free.app'

export async function ping(num: number) {
  await fetch(myURL + "/ping")
    .then(res => console.log("ping " + num, res.status))
    .catch(err => {
      console.log("Error", err.message)
    })
}


const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
const veryIntensiveTask = async (taskDataArguments: { delay: number } & any) => {
  // Example of an infinite loop task
  const { delay } = taskDataArguments;
  await new Promise(async (resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      ping(i);
      await sleep(delay);
    }
  });
};
const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  // linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 2000,
  },
};




export default function Index() {
  // useEffect(() => {
  //   if (!BackgroundService.isRunning()) {
  //     BackgroundService.start(veryIntensiveTask, options);
  //   }
  // }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button
        title="Start Task"
        onPress={() => {
          try {
            BackgroundService.start(veryIntensiveTask, options);
          } catch (error) {
            console.log('error starting task', error);

          }
        }}
      />
      <Button
        title="Stop Task"
        onPress={() => {
          try {
            BackgroundService.stop();
          } catch (error) {
            console.log('error stopping task', error);

          }
        }}
      />
    </View>
  );
}
