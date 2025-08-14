import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Pressable, TextInput } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditScreen() {
  const { id } = useLocalSearchParams()
  const [todo, setTodo] = useState({})
  const router = useRouter()

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp")
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

        if (storageTodos && storageTodos.length) {
          const myTodo = storageTodos.find(todo => todo.id.toString() === id)
          setTodo(myTodo)
        }
      } catch (e) {
        console.log(e);

      }
    }

    fetchData(id)
  }, [id])

  const handleSave = async () => {
    try {
      const savedTodo = { ...todo, title: todo.title }

      const jsonValue = await AsyncStorage.getItem("TodoApp")
      const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

      if (storageTodos && storageTodos.length) {
        const otherTodos = storageTodos.filter(todo => todo.id !== savedTodo.id)
        const allTodos = [...otherTodos, savedTodo]
        await AsyncStorage.setItem('TodoApp', JSON.stringify(allTodos))
      } else {
        await AsyncStorage.setItem('TodoApp', JSON.stringify([savedTodo]))
      }

      router.push('/')
    } catch (e) {
      console.log(e);

    }
  }

  return (
    <SafeAreaView className="bg-black flex-1 w-full">
      <View className="flex-row items-center p-2 gap-6 w-full max-w-[1024] mx-auto pointer-events-auto">
        <TextInput className="flex-1 border-gray-500 border-4 rounded-md p-2 text-2xl font-interMedium min-w-0 text-white" placeholder="Edit Todo" maxLength={30} placeholderTextColor='gray' value={todo?.title || ''} onChangeText={(text) => setTodo(prev => ({ ...todo, title: text }))} />
      </View>
      <View className="flex-row items-center p-2 gap-6 w-full max-w-[1024] mx-auto pointer-events-auto">
        <Pressable className="bg-white border-4 p-2" onPress={handleSave}>
          <Text className="text-2xl text-black" >Save</Text>
        </Pressable>
        <Pressable className="bg-red-500 border-4 p-2" onPress={() => router.push('/')}>
          <Text className="text-2xl text-black" >Return</Text>
        </Pressable>
      </View>
      <StatusBar />
    </SafeAreaView>
  )
}
