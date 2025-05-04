import { createTheme } from "flowbite-react";

export const customTheme =  createTheme({
    ListGroup : {
        "root": {
            "base": "list-none rounded-lg border border-gray-200 bg-white text-left text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        },
        "item": {
            "base": "[&>*]:first:rounded-t-lg [&>*]:last:rounded-b-lg [&>*]:last:border-b-0",
            "link": {
            "base": "flex w-full items-center border-b border-gray-200 px-4 py-2 dark:border-gray-600",
            "active": {
                "off": "hover:bg-gray-100 hover:text-orange-500 focus:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:border-orange-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500",
                "on": "bg-orange-500 text-white dark:bg-gray-800"
            },
            "disabled": {
                "off": "",
                "on": "cursor-not-allowed bg-gray-100 text-gray-900 hover:bg-gray-100 hover:text-gray-900 focus:text-gray-900"
            },
            "href": {
                "off": "",
                "on": ""
            },
            "icon": "mr-2 h-4 w-4 fill-current"
            }
        }
    },

    Dropdown : {
        "arrowIcon": "ml-2 h-4 w-4",
        "content": "py-1 focus:outline-none",
        "floating": {
          "animation": "transition-opacity",
          "arrow": {
            "base": "absolute z-10 h-2 w-2 rotate-45",
            "style": {
              "dark": "bg-gray-900 dark:bg-gray-700",
              "light": "bg-white",
              "auto": "bg-white dark:bg-gray-700"
            },
            "placement": "-4px"
          },
          "base": "z-10 w-fit divide-y divide-gray-100 rounded shadow focus:outline-none",
          "content": "py-1 text-sm text-gray-700 dark:text-gray-200",
          "divider": "my-1 h-px bg-gray-100 dark:bg-gray-600",
          "header": "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200",
          "hidden": "invisible opacity-0",
          "item": {
            "container": "",
            "base": "flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white",
            "icon": "mr-2 h-4 w-4"
          },
          "style": {
            "dark": "bg-gray-900 text-white dark:bg-gray-700",
            "light": "border border-gray-200 bg-white text-gray-900",
            "auto": "border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white"
          },
          "target": "w-fit  focus:ring-2 focus:ring-gray-200"
        },
        "inlineWrapper": "flex items-center"
    },

    Button : {
        "base": "relative flex items-center justify-center rounded-lg text-center font-medium focus:outline-none focus:ring-4",
        "disabled": "pointer-events-none opacity-50",
        "fullSized": "w-full",
        "grouped": "rounded-none border-l-0 first:rounded-s-lg first:border-l last:rounded-e-lg focus:ring-2",
        "pill": "rounded-full",
        "size": {
          "xs": "h-8 px-3 text-xs",
          "sm": "h-9 px-3 text-sm",
          "md": "h-10 px-5 text-sm",
          "lg": "h-12 px-5 text-base",
          "xl": "h-[52px] px-6 text-base"
        },
        "color": {
          "default": "bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800",
          "alternative": "border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700",
          "blue": "bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
          "cyan": "bg-cyan-700 text-white hover:bg-cyan-800 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800",
          "dark": "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700",
          "gray": "bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800",
          "green": "bg-green-700 text-white hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
          "indigo": "bg-indigo-700 text-white hover:bg-indigo-800 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800",
          "light": "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700",
          "lime": "bg-lime-700 text-white hover:bg-lime-800 focus:ring-lime-300 dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800",
          "pink": "bg-pink-700 text-white hover:bg-pink-800 focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800",
          "purple": "bg-purple-700 text-white hover:bg-purple-800 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800",
          "red": "bg-red-700 text-white hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800",
          "teal": "bg-teal-700 text-white hover:bg-teal-800 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800",
          "yellow": "bg-yellow-400 text-white hover:bg-yellow-500 focus:ring-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
        },
        "outlineColor": {
          "default": "border border-primary-700 text-primary-700 hover:border-primary-800 hover:bg-primary-800 hover:text-white focus:ring-primary-300 dark:border-primary-600 dark:text-primary-500 dark:hover:border-primary-700 dark:hover:bg-primary-700 dark:hover:text-white dark:focus:ring-primary-800",
          "blue": "border border-blue-700 text-blue-700 hover:border-blue-800 hover:bg-blue-800 hover:text-white focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:border-blue-700 dark:hover:bg-blue-700 dark:hover:text-white dark:focus:ring-blue-800",
          "cyan": "border border-cyan-700 text-cyan-700 hover:border-cyan-800 hover:bg-cyan-800 hover:text-white focus:ring-cyan-300 dark:border-cyan-500 dark:text-cyan-500 dark:hover:border-cyan-700 dark:hover:bg-cyan-700 dark:hover:text-white dark:focus:ring-cyan-800",
          "dark": "border border-gray-800 text-gray-800 hover:border-gray-900 hover:bg-gray-900 hover:text-white focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800",
          "gray": "border border-gray-700 text-gray-700 hover:border-gray-800 hover:bg-gray-800 hover:text-white focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-800",
          "green": "border border-green-700 text-green-700 hover:border-green-800 hover:bg-green-800 hover:text-white focus:ring-green-300 dark:border-green-600 dark:text-green-500 dark:hover:border-green-700 dark:hover:bg-green-700 dark:hover:text-white dark:focus:ring-green-800",
          "indigo": "border border-indigo-700 text-indigo-700 hover:border-indigo-800 hover:bg-indigo-800 hover:text-white focus:ring-indigo-300 dark:border-indigo-600 dark:text-indigo-400 dark:hover:border-indigo-700 dark:hover:bg-indigo-700 dark:hover:text-white dark:focus:ring-indigo-800",
          "lime": "border border-lime-700 text-lime-700 hover:border-lime-800 hover:bg-lime-800 hover:text-white focus:ring-lime-300 dark:border-lime-600 dark:text-lime-500 dark:hover:border-lime-700 dark:hover:bg-lime-700 dark:hover:text-white dark:focus:ring-lime-800",
          "pink": "border border-pink-700 text-pink-700 hover:border-pink-800 hover:bg-pink-800 hover:text-white focus:ring-pink-300 dark:border-pink-600 dark:text-pink-500 dark:hover:border-pink-700 dark:hover:bg-pink-700 dark:hover:text-white dark:focus:ring-pink-800",
          "purple": "border border-purple-700 text-purple-700 hover:border-purple-800 hover:bg-purple-800 hover:text-white focus:ring-purple-300 dark:border-purple-600 dark:text-purple-400 dark:hover:border-purple-700 dark:hover:bg-purple-700 dark:hover:text-white dark:focus:ring-purple-800",
          "red": "border border-red-700 text-red-700 hover:border-red-800 hover:bg-red-800 hover:text-white focus:ring-red-300 dark:border-red-600 dark:text-red-500 dark:hover:border-red-700 dark:hover:bg-red-700 dark:hover:text-white dark:focus:ring-red-800",
          "teal": "border border-teal-700 text-teal-700 hover:border-teal-800 hover:bg-teal-800 hover:text-white focus:ring-teal-300 dark:border-teal-600 dark:text-teal-400 dark:hover:border-teal-700 dark:hover:bg-teal-700 dark:hover:text-white dark:focus:ring-teal-800",
          "yellow": "border border-yellow-400 text-yellow-400 hover:border-yellow-500 hover:bg-yellow-500 hover:text-white focus:ring-yellow-300 dark:border-yellow-300 dark:text-yellow-300 dark:hover:border-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-white dark:focus:ring-yellow-900"
        }
    },

    DatePicker : {
        "root": {
          "base": "relative"
        },
        "popup": {
          "root": {
            "base": "absolute top-10 z-50 block pt-2",
            "inline": "relative top-0 z-auto",
            "inner": "inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-gray-700"
          },
          "header": {
            "base": "",
            "title": "px-2 py-3 text-center font-semibold text-gray-900 dark:text-white",
            "selectors": {
              "base": "mb-2 flex justify-between",
              "button": {
                "base": "rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
                "prev": "",
                "next": "",
                "view": ""
              }
            }
          },
          "view": {
            "base": "p-1"
          },
          "footer": {
            "base": "mt-2 flex space-x-2",
            "button": {
              "base": "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-cyan-300",
              "today": "bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700",
              "clear": "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            }
          }
        },
        "views": {
          "days": {
            "header": {
              "base": "mb-1 grid grid-cols-7",
              "title": "h-6 text-center text-sm font-medium leading-6 text-gray-500 dark:text-gray-400"
            },
            "items": {
              "base": "grid w-64 grid-cols-7",
              "item": {
                "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                "selected": "bg-cyan-700 text-white hover:bg-cyan-600",
                "disabled": "text-gray-500"
              }
            }
          },
          "months": {
            "items": {
              "base": "grid w-64 grid-cols-4",
              "item": {
                "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                "selected": "bg-cyan-700 text-white hover:bg-cyan-600",
                "disabled": "text-gray-500"
              }
            }
          },
          "years": {
            "items": {
              "base": "grid w-64 grid-cols-4",
              "item": {
                "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                "selected": "bg-cyan-700 text-white hover:bg-cyan-600",
                "disabled": "text-gray-500"
              }
            }
          },
          "decades": {
            "items": {
              "base": "grid w-64 grid-cols-4",
              "item": {
                "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                "selected": "bg-cyan-700 text-white hover:bg-cyan-600",
                "disabled": "text-gray-500"
              }
            }
          }
        }
      }

})