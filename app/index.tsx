import { Text, View, TextInput, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import AsyncStorage from "@react-native-async-storage/async-storage"
import Animated, { LinearTransition } from 'react-native-reanimated'
import { data } from "@/data/todos";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

export default function Index() {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp")
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

        if (storageTodos && storageTodos.length) {
          setTodos(storageTodos.sort((a, b) => b.id - a.id))
        } else {
          setTodos(data.sort((a, b) => b.id - a.id))
        }
      } catch (e) {
        console.log(e);

      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos)
        await AsyncStorage.setItem("TodoApp", jsonValue)
      } catch (e) {
        console.log(e);
      }
    }

    storeData()
  }, [todos])

  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1
      setTodos([{ id: newId, title: text, completed: false }, ...todos])
      setText('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handlePress = (id: number) => {
    router.push(`/todos/${id}`)
  }

  const renderItem = ({ item }) => (
    <View className="flex-row items-center justify-between gap-4 p-2 border-b-gray-500 border-b-2 w-full max-w-[1024] mx-auto pointer-events-auto" >
      <Pressable
        onPress={() => handlePress(item.id)}
        onLongPress={() => toggleTodo(item.id)}
      >
        <Text className={item.completed ? `flex-1 text-sm text-white line-through` : `font-interMedium flex-1 text-sm text-white`}
        >
          {item.title}
        </Text>
      </Pressable>
      <Pressable onPress={() => removeTodo(item.id)}>
        <MaterialCommunityIcons name="delete-circle" size={36} color="red" selectable={undefined} />
      </Pressable>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row p-2 items-center w-full max-w-[1024]">
        <TextInput className="font-interMedium flex-1 border-2 border-white rounded-md p-4 mr-1 font-[18] min-w-0 text-white" placeholder="Add a new todo" maxLength={30} placeholderTextColor="gray" value={text} onChangeText={setText} />
        <Pressable className="bg-white border-4 p-2 rounded-lg" onPress={addTodo} >
          <Text className="text-2xl text-black">Add</Text>
        </Pressable>
      </View>
      <Animated.FlatList data={todos} renderItem={renderItem} contentContainerClassName="grow" itemLayoutAnimation={LinearTransition} keyboardDismissMode='on-drag' />
      <StatusBar />
    </SafeAreaView>
  );
}
