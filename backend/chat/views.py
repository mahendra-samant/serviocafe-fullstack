# import requests
# from django.conf import settings
# from rest_framework.views import APIView
# from rest_framework.response import Response


# class ChatView(APIView):
#     def post(self, request):
#         prompt = request.data.get("prompt", "")
#         if not settings.GEMINI_API_KEY:
#             return Response(
#                 {"response": "Gemini is not configured. Add GEMINI_API_KEY to .env."}
#             )
#         # url = f"https://generativelanguage.googleapis.com/v1/models/{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
#         # try:
#         #     r = requests.post(
#         #         url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=30
#         #     )
#         #     r.raise_for_status()
#         #     data = r.json()
#         #     text = (
#         #         data.get("candidates", [{}])[0]
#         #         .get("content", {})
#         #         .get("parts", [{}])[0]
#         #         .get("text", "")
#         #     )
#         #     return Response({"response": text})
#         # except Exception as e:
#         #     return Response(
#         #         {"response": "Unable to contact Gemini right now."}, status=502
#         #     )
#         print("Gemini model loaded by Django:", settings.GEMINI_MODEL)
#         url = (
#             f"https://generativelanguage.googleapis.com/"
#             f"v1beta/models/{settings.GEMINI_MODEL}:generateContent"
#         )

#         try:
#             r = requests.post(
#                 url,
#                 headers={
#                     "x-goog-api-key": settings.GEMINI_API_KEY,
#                 },
#                 json={"contents": [{"parts": [{"text": prompt}]}]},
#                 timeout=(10, 120),
#             )

#             if not r.ok:
#                 print("Gemini HTTP status:", r.status_code)
#                 print("Gemini error response:", r.text)
#                 r.raise_for_status()

#             data = r.json()
#             answer = data.get("candidates", [{}])[0] \
#                 .get("content", {}).get("parts", [{}])[0].get("text", "")

#             return Response({"response": answer})

#         except requests.exceptions.RequestException as e:
#             print("Gemini request failed:", str(e))
#             return Response(
#                 {"response": "Unable to contact Gemini right now."},
#                 status=502,
#             )


import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response


class ChatView(APIView):
    def post(self, request):
        prompt = request.data.get("prompt", "")

        # Validate the prompt
        if not isinstance(prompt, str) or not prompt.strip():
            return Response(
                {"response": "Please enter a message."},
                status=400,
            )

        # Check API key configuration
        api_key = settings.GEMINI_API_KEY
        model = settings.GEMINI_MODEL

        if not api_key:
            return Response(
                {
                    "response": (
                        "Gemini is not configured. "
                        "Please add GEMINI_API_KEY to your backend .env file."
                    )
                },
                status=500,
            )

        # Gemini API endpoint
        url = (
            "https://generativelanguage.googleapis.com/"
            f"v1beta/models/{model}:generateContent"
        )

        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "maxOutputTokens": 256,
                "temperature": 0.7,
            },
        }

        try:
            response = requests.post(
                url,
                headers={
                    "x-goog-api-key": api_key,
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=(10, 60),
            )

            # Handle errors returned by Google
            if not response.ok:
                print("Gemini HTTP status:", response.status_code)
                print("Gemini error response:", response.text[:2000])

                return Response(
                    {
                        "response": (
                            "Gemini API request failed. "
                            f"HTTP status: {response.status_code}. "
                            "Check the Django terminal for details."
                        )
                    },
                    status=502,
                )

            data = response.json()

            # Extract Gemini's generated response
            candidates = data.get("candidates", [])

            if not candidates:
                print("Gemini returned no candidates:", data)

                return Response(
                    {
                        "response": (
                            "Gemini did not generate a reply. " "Please try again."
                        )
                    },
                    status=502,
                )

            parts = candidates[0].get("content", {}).get("parts", [])

            answer = "\n".join(
                part["text"] for part in parts if isinstance(part.get("text"), str)
            ).strip()

            if not answer:
                print("Gemini returned an empty answer:", data)

                return Response(
                    {"response": "Gemini returned an empty response."},
                    status=502,
                )

            return Response({"response": answer}, status=200)

        except requests.exceptions.Timeout:
            print("Gemini request timed out.")

            return Response(
                {"response": ("Gemini took too long to respond. " "Please try again.")},
                status=504,
            )

        except requests.exceptions.RequestException as error:
            # Do not print the API key or request headers
            print("Gemini connection error:", str(error))

            return Response(
                {
                    "response": (
                        "Unable to connect to Gemini. " "Please try again later."
                    )
                },
                status=502,
            )

        except ValueError:
            print("Gemini returned an invalid JSON response.")

            return Response(
                {"response": "Gemini returned an invalid response."},
                status=502,
            )
