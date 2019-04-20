package main

import (
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	http.HandleFunc("/imglog/log.jpg", imglog)
	http.HandleFunc("/ajaxlog", ajaxlog)
	http.ListenAndServe(":9000", nil)
}

/*
	examples: http://localhost:9000/imglog/log.jpg
	examples: http://localhost:9000/ajaxlog
*/

func imglog(w http.ResponseWriter, req *http.Request) {

	log.Println("IMG")

	// ---------------------
	// Get data from the url
	// ---------------------

	// https://stackoverflow.com/questions/15407719/in-gos-http-package-how-do-i-get-the-query-string-on-a-post-request

	urlData := req.URL.RawQuery
	log.Println("urlData" + urlData)

	clientTimestamp := req.URL.Query()["timestamp"]
	myclientTimestamp := "null"
	if clientTimestamp != nil {
		myclientTimestamp = clientTimestamp[0]
	}

	paramType := req.URL.Query()["type"]
	myparamType := "null"
	if paramType != nil {
		myparamType = paramType[0]
	}

	paramTag := req.URL.Query()["tag"]
	myparamTag := "null"
	if paramTag != nil {
		myparamTag = paramTag[0]
	}

	paramText := req.URL.Query()["text"]
	myparamText := "null"
	if paramText != nil {
		myparamText = paramText[0]
	}

	// ---------------------
	// Write to file
	// ---------------------

	// https://stackoverflow.com/questions/5885486/how-do-i-get-the-current-timestamp-in-go

	t := time.Now()
	str := "[" + t.String() + "]" + "[" + myclientTimestamp + "]" + "[" + myparamType + "]" + "[" + myparamTag + "]" + "[" + myparamText + "]"
	//log.Println(str)
	writetofile(str)

	// ---------------------
	// launch the response
	// ---------------------

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Server", "A Go Web Server")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(200)
}

func ajaxlog(w http.ResponseWriter, r *http.Request) {

	log.Println("AJAX")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Server", "A Go Web Server")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(200)
}

/* ------------- */
/* WRITE TO FILE */
/* ------------- */

func writetofile(somethingToWrite string) {

	// https://golang.org/pkg/os/#OpenFile

	// If the file doesn't exist, create it, or append to the file
	f, err := os.OpenFile("temitas.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal(err)
	}
	//if _, err := f.Write([]byte("appended some data\n")); err != nil {
	if _, err := f.Write([]byte(somethingToWrite + "\n")); err != nil {
		log.Fatal(err)
	}
	if err := f.Close(); err != nil {
		log.Fatal(err)
	}
}
