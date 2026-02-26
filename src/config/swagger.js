export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'CryptoShop Backend API',
    description: 'API de e-commerce con pagos en TRX (TRON)',
    version: '1.0.0',
    contact: {
      name: 'CryptoShop Support'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    },
    {
      url: 'https://crypto-shop-backend.vercel.app',
      description: 'Production server'
    }
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          username: { type: 'string', example: 'johndoe' },
          email: { type: 'string', example: 'john@example.com' },
          phone: { type: 'string', example: '+1 (555) 000-0000' },
          country: { type: 'string', example: 'United States' },
          wallet: {
            type: 'object',
            properties: {
              address: { type: 'string', example: 'TLR3qG5yjpGKzW9x1B2n4Rr6S7T8U9vkK9zw4pXQv' }
            }
          },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          twoFactorEnabled: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          name: { type: 'string', example: 'Wireless Headphones Pro' },
          description: { type: 'string', example: 'Premium wireless headphones with noise cancellation' },
          price: { type: 'number', example: 0.5, description: 'Precio en TRX' },
          stock: { type: 'number', example: 50 },
          category: { type: 'string', enum: ['digital', 'physical', 'service'], example: 'digital' },
          image: { type: 'string', example: 'https://example.com/image.jpg' },
          rating: { type: 'number', example: 4.8, minimum: 0, maximum: 5 },
          reviews: { type: 'number', example: 234 },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Order: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          orderId: { type: 'string', example: '#TRX-94820' },
          userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                name: { type: 'string' },
                price: { type: 'number' },
                quantity: { type: 'number' },
                color: { type: 'string' }
              }
            }
          },
          subtotal: { type: 'number', example: 1.5 },
          networkFee: { type: 'number', example: -0.01 },
          discount: { type: 'number', example: 0 },
          total: { type: 'number', example: 1.49 },
          status: { type: 'string', enum: ['pending', 'completed', 'refunded', 'failed', 'cancelled'] },
          transactionHash: { type: 'string', example: '0x123abc...' },
          walletAddress: { type: 'string', example: 'TLR3qG5yjpGKzW9x1B2n4Rr6S7T8U9vkK9zw4pXQv' },
          merchantAddress: { type: 'string', example: 'TMerchantWalletAddress123...' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Transaction: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
          orderId: { type: 'string' },
          type: { type: 'string', enum: ['purchase', 'refund', 'deposit', 'withdrawal'] },
          amount: { type: 'number', example: 1.49 },
          currency: { type: 'string', example: 'TRX' },
          network: { type: 'string', example: 'TRC-20' },
          transactionHash: { type: 'string', example: '0x123abc...' },
          status: { type: 'string', enum: ['pending', 'confirmed', 'failed'] },
          confirmations: { type: 'number', example: 21 },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Session: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          device: { type: 'string', example: 'Windows • Chrome' },
          ipAddress: { type: 'string', example: '192.168.1.1' },
          lastActive: { type: 'string', format: 'date-time' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token in Authorization header'
      },
      CookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
        description: 'JWT stored in HttpOnly cookie'
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar nuevo usuario',
        description: 'Crea una nueva cuenta de usuario con wallet automática',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'email', 'password'],
                properties: {
                  username: { type: 'string', example: 'johndoe' },
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  password: { type: 'string', format: 'password', minLength: 8, example: 'SecurePass123!' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Usuario registrado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'User registered successfully' },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          400: {
            description: 'Error de validación'
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  password: { type: 'string', format: 'password', example: 'SecurePass123!' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login exitoso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Login successful' },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          401: {
            description: 'Credenciales inválidas'
          }
        }
      }
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Cerrar sesión',
        security: [{ CookieAuth: [] }],
        responses: {
          200: {
            description: 'Sesión cerrada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Logged out successfully' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Renovar token JWT',
        security: [{ CookieAuth: [] }],
        responses: {
          200: {
            description: 'Token renovado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Token refreshed' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/profile': {
      get: {
        tags: ['Auth'],
        summary: 'Obtener perfil del usuario',
        security: [{ CookieAuth: [] }],
        responses: {
          200: {
            description: 'Perfil del usuario',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/users/profile': {
      get: {
        tags: ['Users'],
        summary: 'Obtener perfil detallado del usuario',
        security: [{ CookieAuth: [] }],
        responses: {
          200: {
            description: 'Perfil del usuario con todos los detalles',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Users'],
        summary: 'Actualizar perfil del usuario',
        security: [{ CookieAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string', example: 'newusername' },
                  phone: { type: 'string', example: '+1 (555) 111-2222' },
                  country: { type: 'string', example: 'Canada' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Perfil actualizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Profile updated successfully' },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/users/password': {
      put: {
        tags: ['Users'],
        summary: 'Cambiar contraseña',
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                  currentPassword: { type: 'string', format: 'password', example: 'OldPass123!' },
                  newPassword: { type: 'string', format: 'password', minLength: 8, example: 'NewPass456!' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Contraseña actualizada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Password updated successfully' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/users/wallet/connect': {
      post: {
        tags: ['Users'],
        summary: 'Conectar billetera TRON',
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['walletAddress'],
                properties: {
                  walletAddress: { type: 'string', example: 'TLR3qG5yjpGKzW9x1B2n4Rr6S7T8U9vkK9zw4pXQv' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Billetera conectada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Wallet connected successfully' },
                    wallet: { type: 'string', example: 'TLR3qG5yjpGKzW9x1B2n4Rr6S7T8U9vkK9zw4pXQv' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/wallet/balance': {
      get: {
        tags: ['Wallet'],
        summary: 'Obtener balance de TRX',
        security: [{ CookieAuth: [] }],
        responses: {
          200: {
            description: 'Balance de la billetera',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    address: { type: 'string', example: 'TLR3qG5yjpGKzW9x1B2n4Rr6S7T8U9vkK9zw4pXQv' },
                    trx: { type: 'number', example: 45.3 },
                    network: { type: 'string', example: 'TRC-20' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/wallet/send-trx': {
      post: {
        tags: ['Wallet'],
        summary: 'Enviar TRX',
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['toAddress', 'amount'],
                properties: {
                  toAddress: { type: 'string', example: 'TMerchantWalletAddress123...' },
                  amount: { type: 'number', example: 1.5 }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'TRX enviado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'TRX sent successfully' },
                    transaction: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Obtener todos los productos',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'number', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'number', default: 10 } }
        ],
        responses: {
          200: {
            description: 'Lista de productos',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'number', example: 25 },
                    products: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Product' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Crear producto (solo admin)',
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'price', 'category'],
                properties: {
                  name: { type: 'string', example: 'Wireless Headphones Pro' },
                  description: { type: 'string', example: 'Premium headphones with noise cancellation' },
                  price: { type: 'number', example: 0.5, description: 'En TRX' },
                  stock: { type: 'number', example: 50 },
                  category: { type: 'string', enum: ['digital', 'physical', 'service'] },
                  image: { type: 'string', example: 'https://example.com/image.jpg' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Producto creado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Product created successfully' },
                    product: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Obtener producto por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Detalles del producto',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    product: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Products'],
        summary: 'Actualizar producto (solo admin)',
        security: [{ CookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  price: { type: 'number' },
                  stock: { type: 'number' },
                  isActive: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Producto actualizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Product updated successfully' },
                    product: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Eliminar producto (solo admin)',
        security: [{ CookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Producto eliminado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Product deleted successfully' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Crear nueva orden',
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['products'],
                properties: {
                  products: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productId: { type: 'string' },
                        quantity: { type: 'number', example: 2 },
                        color: { type: 'string' }
                      }
                    },
                    example: [{ productId: '507f1f77bcf86cd799439011', quantity: 2, color: 'Black' }]
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Orden creada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Order created successfully' },
                    order: { $ref: '#/components/schemas/Order' }
                  }
                }
              }
            }
          }
        }
      },
      get: {
        tags: ['Orders'],
        summary: 'Obtener órdenes del usuario',
        security: [{ CookieAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'completed', 'failed', 'cancelled'] } },
          { name: 'page', in: 'query', schema: { type: 'number', default: 1 } }
        ],
        responses: {
          200: {
            description: 'Lista de órdenes',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    orders: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Order' }
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        total: { type: 'number' },
                        page: { type: 'number' },
                        pages: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Obtener detalles de orden',
        security: [{ CookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Detalles de la orden',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    order: { $ref: '#/components/schemas/Order' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/orders/{id}/pay': {
      post: {
        tags: ['Orders'],
        summary: 'Pagar orden con TRX',
        security: [{ CookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Pago procesado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Payment processed successfully' },
                    order: { $ref: '#/components/schemas/Order' },
                    transaction: { $ref: '#/components/schemas/Transaction' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/orders/{id}/status': {
      patch: {
        tags: ['Orders'],
        summary: 'Actualizar estado de orden (solo admin)',
        security: [{ CookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['pending', 'completed', 'refunded'] },
                  transactionHash: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Estado actualizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Order status updated' },
                    order: { $ref: '#/components/schemas/Order' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/transactions': {
      get: {
        tags: ['Transactions'],
        summary: 'Obtener historial de transacciones',
        security: [{ CookieAuth: [] }],
        parameters: [
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['purchase', 'refund', 'deposit', 'withdrawal'] } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'confirmed', 'failed'] } },
          { name: 'page', in: 'query', schema: { type: 'number', default: 1 } }
        ],
        responses: {
          200: {
            description: 'Historial de transacciones',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    transactions: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Transaction' }
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        total: { type: 'number' },
                        page: { type: 'number' },
                        pages: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/sessions': {
      get: {
        tags: ['Sessions'],
        summary: 'Obtener sesiones activas',
        security: [{ CookieAuth: [] }],
        responses: {
          200: {
            description: 'Lista de sesiones',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    sessions: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Session' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/sessions/{id}': {
      delete: {
        tags: ['Sessions'],
        summary: 'Terminar sesión específica',
        security: [{ CookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Sesión terminada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Session terminated successfully' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/security/2fa/enable': {
      post: {
        tags: ['Security'],
        summary: 'Habilitar autenticación de dos factores',
        security: [{ CookieAuth: [] }],
        responses: {
          200: {
            description: '2FA habilitado con código QR',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: '2FA setup initiated' },
                    qrCode: { type: 'string', example: 'data:image/png;base64,...' },
                    secret: { type: 'string', example: 'JBSWY3DPEHPK3PXP' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/security/2fa/verify': {
      post: {
        tags: ['Security'],
        summary: 'Verificar código 2FA',
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['code'],
                properties: {
                  code: { type: 'string', example: '123456', description: 'Código de 6 dígitos del autenticador' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: '2FA verificado y activado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: '2FA enabled successfully' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/admin/stats': {
      get: {
        tags: ['Admin'],
        summary: 'Dashboard stats para admin',
        security: [{ CookieAuth: [] }],
        responses: {
          200: {
            description: 'Estadisticas del dashboard admin',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    stats: { type: 'object' },
                    chartData: { type: 'array', items: { type: 'object' } },
                    recentSales: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                    topProducts: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/admin/sales': {
      get: {
        tags: ['Admin'],
        summary: 'Ventas para admin',
        security: [{ CookieAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'page', in: 'query', required: false, schema: { type: 'integer', example: 1 } },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer', example: 10 } }
        ],
        responses: {
          200: {
            description: 'Lista paginada de ventas',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    sales: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                    pagination: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/admin/orders/{id}/status': {
      patch: {
        tags: ['Admin'],
        summary: 'Actualizar estado de orden (admin)',
        security: [{ CookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['pending', 'completed', 'refunded'] },
                  transactionHash: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Estado actualizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Order status updated' },
                    order: { $ref: '#/components/schemas/Order' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/admin/orders/{id}/refund': {
      post: {
        tags: ['Admin'],
        summary: 'Reembolsar orden en blockchain',
        security: [{ CookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Reembolso enviado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Refund sent. Waiting for blockchain confirmation.' },
                    transaction: { $ref: '#/components/schemas/Transaction' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'Usuarios (admin)',
        security: [{ CookieAuth: [] }],
        parameters: [
          { name: 'role', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'page', in: 'query', required: false, schema: { type: 'integer', example: 1 } },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer', example: 10 } }
        ],
        responses: {
          200: {
            description: 'Lista de usuarios',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    users: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                    stats: { type: 'object' },
                    pagination: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/admin/customers': {
      get: {
        tags: ['Admin'],
        summary: 'Clientes con totalSpent',
        security: [{ CookieAuth: [] }],
        parameters: [
          { name: 'search', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'page', in: 'query', required: false, schema: { type: 'integer', example: 1 } },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer', example: 10 } }
        ],
        responses: {
          200: {
            description: 'Lista de clientes',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    users: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                    stats: { type: 'object' },
                    pagination: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/admin/customers/{id}/block': {
      patch: {
        tags: ['Admin'],
        summary: 'Bloquear o desbloquear cliente',
        security: [{ CookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  isActive: { type: 'boolean', example: false }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Cliente actualizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'User blocked' },
                    user: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/admin/customers/export': {
      post: {
        tags: ['Admin'],
        summary: 'Exportar clientes en CSV',
        security: [{ CookieAuth: [] }],
        responses: {
          200: {
            description: 'CSV exportado'
          }
        }
      }
    },
    '/api/admin/products': {
      get: {
        tags: ['Admin'],
        summary: 'Lista de productos (admin)',
        security: [{ CookieAuth: [] }],
        parameters: [
          { name: 'search', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'category', in: 'query', required: false, schema: { type: 'string', enum: ['digital', 'physical', 'service'] } },
          { name: 'page', in: 'query', required: false, schema: { type: 'integer', example: 1 } },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer', example: 10 } }
        ],
        responses: {
          200: {
            description: 'Lista de productos',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    products: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                    pagination: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Admin'],
        summary: 'Crear producto (admin)',
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' }
            }
          }
        },
        responses: {
          201: {
            description: 'Producto creado'
          }
        }
      }
    },
    '/api/admin/products/{id}': {
      patch: {
        tags: ['Admin'],
        summary: 'Actualizar producto (admin)',
        security: [{ CookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' }
            }
          }
        },
        responses: {
          200: {
            description: 'Producto actualizado'
          }
        }
      },
      delete: {
        tags: ['Admin'],
        summary: 'Eliminar producto (admin)',
        security: [{ CookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Producto eliminado'
          }
        }
      }
    }
  }
};
